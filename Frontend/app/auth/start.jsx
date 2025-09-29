import { useRouter } from 'expo-router';
import React from 'react'
import { Image, TouchableOpacity } from 'react-native';
import { Dimensions, ImageBackground, Pressable, StatusBar, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const StartPage = () => {

  const router=useRouter();
  
  const {height}=Dimensions.get("window");
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
                <Pressable className="mt-5 w-full border border-gray-200 opacity-80 flex flex-row rounded-full items-center justify-center gap-3" style={{paddingHorizontal:scale(7), paddingVertical:verticalScale(14)}}>
                  <Image source={require("../../assets/images/search.png")} className="w-6 h-6"/>
                  <Text className="font-semibold text-lg">Log In with Google</Text>
                </Pressable>
                <View className="flex flex-row gap-1 w-full justify-center items-center mt-8">
                  <Text className="text-xl font-medium text-gray-500 tracking-wide">Already have an account?</Text>
                  <Text onPress={() => router.push("/auth/sign-in")} className="text-blue-500 active:opacity-65 text-lg font-semibold">Sign in</Text>
                </View>
            </View>
        </SafeAreaView>
    </View>
  )
}

export default StartPage
