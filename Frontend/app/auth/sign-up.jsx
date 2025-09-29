import { useRouter } from 'expo-router'
import { Eye, EyeOff,Lock,LockKeyhole, Mail, User } from 'lucide-react-native'
import React, { useRef, useState } from 'react'
import { ImageBackground, StatusBar, Text, View ,TouchableOpacity, TextInput, Pressable, Image, Modal} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'


const SignUp = () => {
  
  const [focusField,setFocusField]=useState({
    name:false,
    email:false,
    password:false,
  });
  const [otpFocus,setOtpFocus]=useState(false);
  const [signupSuccess,setSignupSuccess]=useState(false);
  const [visible,setVisible]=useState(false);
  const nameRef=useRef(null);
  const emailRef=useRef(null);
  const passwordRef=useRef(null);
  const router=useRouter();

  return (
    <View style={{flex:1, backgroundColor:"#fff"}}>

      <StatusBar
        barStyle='dark-content'
        backgroundColor="transparent"
        translucent={true}
      />

      <ImageBackground source={require("../../assets/images/signup-car.png")} className="w-full" style={{height:250}} resizeMode='cover'>
        <View className="w-full h-full flex justify-end items-start px-6 pb-10">
          <Text className="font-semibold tracking-wide" style={{fontSize:24}}>Create Your Account</Text>
        </View>
      </ImageBackground>
      <SafeAreaView  style={{flex:1}} edges={["bottom","right","left"]}>
          <View className="flex-1 px-6 py-1">
            <KeyboardAwareScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
              <View className="flex-1">
                <Text className="font-semibold text-xl">Name</Text>
                <TouchableOpacity onPress={() => nameRef.current?.focus()} className={`w-full rounded-full outline-none flex flex-row gap-2 border-2 mt-2 items-center justify-start ${focusField.name?"   border-blue-500  ":"border-transparent"}`} style={{paddingHorizontal:scale(19), paddingVertical:verticalScale(4), backgroundColor: 'rgba(227, 242, 253, 0.2)'}}>
                  <User size={20} strokeOpacity={0.5} strokeWidth={2}/>
                  <TextInput
                    ref={nameRef}
                    onFocus={() => setFocusField(prev=> ({...prev,name:true}))}
                    onBlur={() => setFocusField(prev=> ({...prev,name:false}))}
                    placeholder='Enter name'
                    placeholderTextColor='gray'
                    className="text-md flex-1 font-semibold text-black outline-none"
                  />
                </TouchableOpacity>
                <Text className="text-xl font-semibold mt-4">Email</Text>
                <TouchableOpacity onPress={() => emailRef.current.focus()} className={`w-full flex flex-row justify-start mt-2 items-center gap-2 rounded-full border-2 outline-none ${focusField.email?"border-blue-500":"border-transparent"}`} style={{paddingHorizontal:scale(19), paddingVertical:verticalScale(4), backgroundColor: 'rgba(227, 242, 253, 0.2)'}}>
                  <Mail size={20} strokeOpacity={0.5} strokeWidth={2}/>
                  <TextInput 
                    ref={emailRef}
                    onFocus={() => setFocusField(prev=> ({...prev,email:true}))}
                    onBlur={() => setFocusField(prev=> ({...prev,email:false}))}
                    placeholder='Enter email'
                    placeholderTextColor='gray'
                    className="text-md flex-1 font-semibold text-black outline-none"
                  />
                </TouchableOpacity>
                <Text className="font-semibold text-xl mt-4">Password</Text>
                <TouchableOpacity onPress={() => passwordRef.current?.focus()} className={`w-full flex flex-row border-2 justify-start mt-2  items-center gap-2 rounded-full outline-none ${focusField.password?"border-blue-500":"border-transparent"}`}  style={{paddingHorizontal:scale(19), paddingVertical:verticalScale(4), backgroundColor: 'rgba(227, 242, 253, 0.2)'}}>
                  <LockKeyhole size={20} strokeWidth={2} strokeOpacity={0.5}/>
                  <TextInput
                    ref={passwordRef}
                    onFocus={() => setFocusField(prev=> ({...prev,password:true}))}
                    onBlur={() => setFocusField(prev=> ({...prev,password:false}))}
                    placeholder='Enter password'
                    placeholderTextColor='gray'
                    className="text-md font-semibold text-black outline-none flex-1"
                    secureTextEntry={!visible}
                  />
                  {visible?<Eye onPress={() => setVisible(!visible)} size={18} strokeWidth={2} strokeOpacity={0.5}/>:<EyeOff onPress={() => setVisible(!visible)} size={18} strokeWidth={2} strokeOpacity={0.5}/>}
                </TouchableOpacity>
                <Pressable  onPress={() => setSignupSuccess(true)} className="w-full active:opacity-80 bg-[#0286FF] mt-8 rounded-full flex items-center justify-center" style={{height:verticalScale(38)}}>
                  <Text className="text-lg font-semibold text-white">Sign up</Text>
                </Pressable>
                <View className="mt-6 flex w-full flex-row gap-3 items-center">
                  <View className="flex-1 w-full border border-gray-200"></View>
                  <Text className="font-semibold text-xl tracking-wide">Or</Text>
                  <View className="w-full flex-1 border border-gray-200"></View>
                </View>
                <Pressable className="mt-5 w-full border border-gray-200 opacity-80 flex flex-row rounded-full items-center justify-center gap-3" style={{paddingHorizontal:scale(7), paddingVertical:verticalScale(14)}}>
                  <Image source={require("../../assets/images/search.png")} className="w-6 h-6"/>
                  <Text className="font-semibold text-lg">Log In with Google</Text>
                </Pressable>
                <View className="flex flex-row gap-1 w-full justify-center items-center mt-8">
                  <Text className="text-xl font-medium text-gray-500 tracking-wide">Already have an account?</Text>
                  <Text onPress={() => router.push("/auth/sign-in")} className="text-blue-500 active:opacity-65 text-lg font-semibold">Sign in</Text>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        
      </SafeAreaView>

      <Modal onRequestClose={() => setSignupSuccess(false)} visible={signupSuccess} animationType='slide' transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/40 p-4">
            <View className="w-full rounded-xl flex items-start bg-white px-6 py-8">
              <Text className="font-bold text-2xl">Verification</Text>
              <Text className="font-medium text-md mt-3">{"We've sent a verification code to"}</Text>
              <Text className="font-medium text-sm">{"raghul19april@gmail.com"}</Text>
              <Text className="mt-6 font-semibold text-xl">Code</Text>
              <View className={`mt-3 flex flex-row items-center gap-3 w-full border-2 ${otpFocus?"border-blue-500":"border-transparent"} bg-neutral-200/50 rounded-full`} style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(6)}}>
                <LockKeyhole size={18} strokeOpacity={0.5} strokeWidth={2}/>
                <TextInput onFocus={() => setOtpFocus(true)} onBlur={() => setOtpFocus(false)} className="text-lg font-medium flex-1"/>
              </View>
              <Pressable onPress={() => router.push("/auth/sign-in")} className="mt-8 w-full bg-green-600 rounded-full flex active:opacity-65 items-center justify-center" style={{paddingVertical:verticalScale(13)}}>
                <Text className="text-lg tracking-wide text-white font-semibold">Verify Email</Text>
              </Pressable>
            </View>
        </View>
      </Modal>

    </View>
  )
}

export default SignUp
