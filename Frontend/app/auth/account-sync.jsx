import React, { useState } from 'react'
import { View, Text,Image, Pressable, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Line } from 'react-native-svg';
import clerk from '../../assets/images/clerk.png'
import { scale, verticalScale } from 'react-native-size-matters';
import { ShieldAlert } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import { apiCalls } from '../utils/apiCalls';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AccountSync = () => {

  const [width, setWidth] = useState(0);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const {getToken}=useAuth();
  const router=useRouter();


  const handleLayout = (event) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const dashLength = 6;
  const gap = 6;

  // Calculate pattern so it fills evenly
  const totalSegment = dashLength + gap;
  const segmentCount = Math.floor(width / totalSegment);
  const adjustedGap = width / segmentCount - dashLength;

  const handleAccountSync=async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve,2000));
    try {
      const token=await getToken({template:"id_token"});
      const response=await apiCalls.createOrGetUserData({token});
      await AsyncStorage.setItem("user",JSON.stringify(response.data));
      setError("");
      router.replace("/page/home");
    } catch(error) {
      setError("Something went wrong. Try again!");
      console.log(error.message);
    }
    setLoading(false);
  }

  return (
    <View style={{flex:1, backgroundColor:"white"}}>
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <View className="flex-1 p-4">
          <View className="w-full h-[50%] flex items-center justify-end">
            <View className="w-full flex flex-row items-center justify-between h-[80%] rounded-xl bg-gray-200/60 px-4">
              <View style={{width:90,height:80,backgroundColor:"white"}} className="rounded-xl flex flex-row justify-center items-center">
                <Image source={clerk} resizeMode='contain' style={{width:60}}/>
              </View>
              <View className="flex-1 flex-row mx-2 justify-between items-center" onLayout={handleLayout}>
                <View className="bg-orange-500 w-2 h-2 rounded-full"></View>
                <View className="flex-1 mx-2">
                  <Svg height="2" width="100%">
                    <Line
                      x1="0"
                      y1="1"
                      x2={width}
                      stroke="#ef4444"
                      y2="1"
                      strokeWidth="1"
                      strokeDasharray={`${dashLength},${adjustedGap}`}
                    />
                    </Svg>
                </View>
                <View className="bg-orange-500 w-2 h-2 rounded-full"></View>
              </View>

              <View style={{width:90,height:80,backgroundColor:"white"}} className="rounded-xl flex flex-row items-center justify-center">
                <Text className="text-blue-600 font-extrabold" style={{fontSize:20}}>Ryder</Text>
              </View>
            </View>
          </View>
          <View className="w-full h-[50%] flex mt-10">
            <Text className="text-md text-center text-neutral-400 font-medium tracking-wide">Keep your account synced and secure.</Text>
            <Text className="text-md text-center text-neutral-400 mt-1 font-medium tracking-wide">Instant updates, every time you connect.</Text>
            <Pressable onPress={handleAccountSync} className="mt-10 w-full active:opacity-55 bg-black rounded-xl flex items-center justify-center" style={{paddingVertical:verticalScale(13)}}>
              {loading?<ActivityIndicator color="white"/>:<Text className="font-semibold text-white text-md tracking-wide">Sync now</Text>}
            </Pressable>
            {error &&
              <View className="w-full bg-red-300/60 mt-5 overflow-scroll rounded-md gap-3 shadow-md flex flex-row items-center justify-start" style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(9)}}>
                <ShieldAlert size={14} color={"red"}/>
                <Text numberOfLines={1}  className="flex-1 text-sm text-red-500 font-semibold">{error}</Text>
              </View>
            }
          </View>
          
        </View>
      </SafeAreaView>
    </View>
  )
}

export default AccountSync
