
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LockKeyhole, ShieldAlert } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const Verify = ({visible,onClose,handleOtpVerification,handleResendOtp,update,email}) => {

  const [otpFocus,setOtpFocus]=useState(false);
  const [otp,setOtp]=useState("");
  const [disabled,setDisabled]=useState(true);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [time, setTime] = useState(120);
  const [editable,setEditable]=useState(true);
  const router=useRouter();

  useEffect(() => {
    if(otp.trim() && otp.length===6) {
        setDisabled(false);
    } else {
        setDisabled(true);
    }
  },[otp])

  useEffect(() => {
    if (time <= 0) {
      setError("Verification code expired");
      setEditable(false);
      setOtp("");
      return;
    }; 
    const interval = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000); // decrease every second

    return () => clearInterval(interval); // cleanup
  }, [time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedSecs = secs < 10 ? `0${secs}` : secs; // pad single digit
    return `${mins}:${formattedSecs}`;
  };

  const verifyOtp=async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve,2000));
    try {
        await handleOtpVerification(otp);
        setError("");
        if(!update) {
          router.replace("/auth/account-sync")
        } else {
          onClose(false);
        }
    } catch(error) {
        if(error.errors[0]) {
            setError(error.errors[0].message);
        } else {
            setError("Network error");
        }
        console.log(error.message);
    }
    setLoading(false);
  }

  const handleResendOtpVerification=async () => {
    try {
      await handleResendOtp();
      setTime(120);
      setEditable(true);
      if(error==="Verification code expired") {
        setError("");
      }
    } catch(error) {
      console.log(error.message);
      setError("Network Error");
    }
    
  }
  return (
    <Modal onRequestClose={() => onClose(false)} visible={visible} animationType='slide' transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/40 p-4">
            <View className="w-full rounded-xl flex items-start bg-white px-6 py-8">
              <Text className="font-bold text-2xl">Verification</Text>
              <Text className="font-medium text-md mt-3">{"We've sent a verification code to"}</Text>
              <Text className="font-medium text-sm">{"raghul19april@gmail.com"}</Text>
              <Text className="mt-6 font-semibold text-xl">Code</Text>
              <View className={`mt-3 flex flex-row items-center gap-3 w-full border-2 ${otpFocus?"border-blue-500":"border-transparent"} bg-neutral-200/50 rounded-full`} style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(6)}}>
                <LockKeyhole size={18} strokeOpacity={0.5} strokeWidth={2}/>
                <TextInput editable={editable} keyboardType='numeric' maxLength={6} value={otp} onChangeText={(text) => setOtp(text)} onFocus={() => setOtpFocus(true)} onBlur={() => setOtpFocus(false)} className="text-lg font-medium flex-1"/>
              </View>
              <Pressable onPress={verifyOtp} disabled={disabled} className="mt-8 w-full disabled:bg-green-300 bg-green-600 rounded-full flex active:opacity-65 items-center justify-center" style={{paddingVertical:verticalScale(13)}}>
                {loading?<ActivityIndicator color='white' size="small"/>:<Text className="text-lg tracking-wide text-white font-semibold">Verify Email</Text>}
              </Pressable>
              <View className="flex flex-row justify-center mt-5 w-full">
                {time===0 ? <Text onPress={handleResendOtpVerification} className="font-medium text-sm active:opacity-55 text-gray-400">Resend OTP</Text>:<Text onPress={handleResendOtpVerification} className="font-medium text-sm active:opacity-55 text-gray-400">{formatTime(time)}</Text>}
              </View>
              {error && 
                <View className="w-full bg-red-300/60 mt-5 rounded-md gap-3 shadow-md flex flex-row items-center justify-start" style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(9)}}>
                  <ShieldAlert size={14} color={"red"}/>
                  <Text className="text-sm text-red-500 font-semibold">{error}</Text>
                </View>
              }
            </View>
        </View>
    </Modal>
  )
}

export default Verify
