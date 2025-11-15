    import React, { useEffect, useState } from 'react'
    import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native'
    import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
    import { SafeAreaView } from 'react-native-safe-area-context';
    import { scale, verticalScale } from 'react-native-size-matters';
    import { menubar } from '../dataSet';
    import { usePathname, useRouter } from 'expo-router';

    const Layout = ({children}) => {
    
    const pathName=usePathname();
    const router=useRouter();
    const [keyboardHeight,setKeyboardHeight]=useState(0);

    useEffect(() => {
        const show=Keyboard.addListener(
            Platform.OS==='android'?"keyboardDidShow":"keyboardWillShow",
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );

        const hide=Keyboard.addListener(
            Platform.OS==="android"?"keyboardDidHide":"keyboardWillHide",
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );

        return () => {
            show.remove(); hide.remove();
        }
    })


    return (
        <View className="flex-1 bg-[#F6F8FA]">
            <SafeAreaView style={{flex:1, backgroundColor:"#f6f8fa"}} edges={["top","left","right"]}>
                
                <View className="flex-1 relative">
                    <View className="flex-1 px-5">
                        {children}
                    </View>
                    <View className="bg-transparent" style={{position:"absolute", width:"100%", bottom:keyboardHeight, paddingHorizontal:scale(20),paddingVertical:verticalScale(20),left:0,right:0, alignItems:"center"}}>
                    
                        
                        <View className="w-[100%] bg-[#333333] rounded-full" style={{zIndex:1000,paddingHorizontal:scale(18),paddingVertical:verticalScale(14)}}>
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
