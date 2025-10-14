import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react'
import {Image, Dimensions, ImageBackground, Pressable, StatusBar, Text, View, ActivityIndicator, Modal} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import * as Linking from 'expo-linking';
import { ShieldAlert } from 'lucide-react-native';

const StartPage = () => {

  const router=useRouter();
  const [loading,setLoading]=useState(false);
  const {startOAuthFlow}=useOAuth({strategy:"oauth_google"});  
  const {height}=Dimensions.get("window");
  const [oauthStatus,setOauthStatus]=useState(false);
  const [error,setError]=useState("");
  const [loginSuccess,setLoginSuccess]=useState(false);
  const handleOauthSignin=async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve,2000));
    try {
      const {createdSessionId,setActive}=await startOAuthFlow({redirectUrl:Linking.createURL("auth/start")});
      if(createdSessionId) {
        setLoginSuccess(true);
        setError("");
        await setActive({session:createdSessionId});
      } else {
        setLoginSuccess(false);
        setError({status:true,message:"Something went wrong and try again!"});      
      }

    } catch(error) {
      console.log(error.message);
      setLoginSuccess(false);
      if(error.errors[0]) {
        setError(error.errors[0].message);
      } else {
        setError("Network error");
      }
    }
    setLoading(false);
    setOauthStatus(true);
  }
  return (
    <View className="bg-white flex-1">
        <StatusBar
            barStyle="dark-content"
            translucent={true}
            backgroundColor="transparent"
        />

        <ImageBackground
            style={{width:"100%", height:height*0.5}}
            source={require("../../assets/images/get-started.png")}
            resizeMode='cover'
        />

        <SafeAreaView style={{flex:1, backgroundColor:"white"}} edges={["left","right","bottom"]}>
            <View className="flex-1 px-5 pb-4 mt-2">
                <Text className="font-semibold tracking-wider text-center" style={{fontSize:25}}>{"Let's get started"}</Text>
                <Text className="text-neutral-400 text-lg tracking-wide text-center mt-3 font-medium">{"Sign up or log in to find out the best\ncar for you"}</Text>
                <Pressable  
                    onPress={() => router.push("/auth/sign-up")}
                    activeOpacity={0.5}  
                    className="mt-8 flex items-center justify-center w-full active:opacity-65 shadow-md shadow-neutral-400/70 rounded-full bg-blue-500" 
                    style={{
                        padding: moderateScale(14   ),
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5, // For Android
                      }}
                >
                    <Text className="text-lg font-semibold tracking-widest text-white">Sign Up</Text>
                </Pressable>
                <View className="w-full mt-6 gap-3 flex flex-row items-center">
                    <View className="flex-1 border border-gray-200"></View>
                    <Text className="text-lg text-[#333333] font-semibold tracking-wide">Or</Text>
                    <View className="flex-1 border border-gray-200"></View>
                </View>
                <Pressable onPress={handleOauthSignin} className="mt-5 w-full border border-gray-200 opacity-80 flex flex-row rounded-full items-center justify-center gap-3" style={{paddingHorizontal:scale(7), paddingVertical:verticalScale(14)}}>
                  <Image source={require("../../assets/images/search.png")} className="w-6 h-6"/>
                  {loading?<ActivityIndicator color="black"/>:<Text className="font-semibold text-lg">Log In with Google</Text>}
                </Pressable>
                <View className="flex flex-row gap-1 w-full justify-center items-center mt-8">
                  <Text className="text-xl font-medium text-gray-500 tracking-wide">Already have an account?</Text>
                  <Text onPress={() => router.push("/auth/sign-in")} className="text-blue-500 active:opacity-65 text-lg font-semibold">Sign in</Text>
                </View>
            </View>
        </SafeAreaView>
        <Modal visible={oauthStatus} onRequestClose={() => setOauthStatus(false)} animationType='slide' transparent>
          <View className="flex-1 justify-center bg-black/40 items-center px-3">
              <View className="w-full flex items-center rounded-2xl py-10 px-4 bg-white">
                {loginSuccess
                  ?
                  <>
                  <Image source={require("../../assets/images/check.png")} style={{width:70, height:70}}/>
                  <Text className="mt-8 font-semibold text-2xl tracking-wider">Verified!</Text>
                  <Text className="text-center text-lg text-neutral-400 mt-4">{"You have successfully verified \nyour account"}</Text>
                  <Pressable onPress={() => router.replace("/auth/account-sync")} className="flex items-center justify-center bg-blue-500 mt-8 w-full py-4 rounded-full  active:opacity-70">
                      <Text className="text-md font-semibold text-white tracking-wider">Browse Home</Text>
                  </Pressable>
                  </>
                  :
                  <>
                  <Image source={require("../../assets/images/lock.png")} style={{width:120, height:120}}/>
                  <Text className="font-semibold text-2xl tracking-wider mt-0">Login Failed!</Text>
                  <View className="w-full bg-red-300/60 mt-5 overflow-scroll rounded-md gap-3 shadow-md flex flex-row items-center justify-start" style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(9)}}>
                    <ShieldAlert size={14} color={"red"}/>
                      <Text numberOfLines={1}  className="flex-1 text-sm text-red-500 font-semibold">{error}</Text>
                  </View>
                  <Pressable onPress={() => setOauthStatus(false)}  className="mt-5 w-full active:opacity-55 bg-black rounded-xl flex items-center justify-center" style={{paddingVertical:verticalScale(13)}}>
                    <Text className="font-semibold text-white text-md tracking-wide">Try again</Text>
                  </Pressable>
                  </>
                }
              </View>
          </View>
        </Modal>
    </View>
  )
}

export default StartPage
