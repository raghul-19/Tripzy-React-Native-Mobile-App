import React from 'react'
import { Image, Pressable, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import { menubar } from '../dataSet';
import { usePathname, useRouter } from 'expo-router';

const Layout = ({children}) => {
  
  const pathName=usePathname();
  const router=useRouter();
  return (
    <View className="flex-1 bg-[#F6F8FA]">
        <SafeAreaView style={{flex:1, backgroundColor:"#f6f8fa"}} edges={["top","left","right"]}>
            <View className="flex-1">
                <View className="w-full h-[85%]">
                    <KeyboardAwareScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
                        {children}
                    </KeyboardAwareScrollView>
                </View>
                <View className="w-full h-[15%] bg-white px-5 py-3">
                    <View className="w-full bg-[#333333] rounded-full" style={{paddingHorizontal:scale(18),paddingVertical:verticalScale(14)}}>
                        <View className="flex flex-row justify-between items-center">
                            {menubar.map((menu,index) => {
                                const isActive=pathName===menu.route;
                                return (
                                    <Pressable onPress={() => router.push(menu.route)} key={index} className={`w-14 h-14 rounded-full  flex items-center ${isActive?"bg-[#0CC25F]":"bg-transparent"} justify-center`}>
                                        <Image style={{width:25, height:25}}  source={menu.image}/>
                                    </Pressable>
                                )
                            })}
                        </View>
                        
                    </View>
                </View>
            </View> 
        </SafeAreaView>
    </View>
  )
}

export default Layout;
