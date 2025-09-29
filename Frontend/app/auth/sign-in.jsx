import { useRouter } from 'expo-router'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image, ImageBackground, Modal, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'
    
const SignIn = () => {

            const [focusField,setFocusField]=useState({
                email:false,
                password:false,
            });
            const [visible,setVisible]=useState(false);
            const emailRef=useRef(null);
            const passwordRef=useRef(null);
            const router=useRouter();
            const [loginSuccess,setLoginSuccess]=useState(false);
            return (
            
                <View style={{flex:1, backgroundColor:"white"}} >
                

                    <StatusBar
                        barStyle='dark-content'
                        backgroundColor='transparent'
                        translucent={true}
                    />
                    <ImageBackground
                        source={require("../../assets/images/signup-car.png")}
                        style={{width:"100%", height:250}}
                        imageStyle={{resizeMode:"cover"}}
                    >
                        <View className="flex-1 justify-end px-6 pb-10">
                            <Text className="font-semibold tracking-wide" style={{fontSize:24}}>Welcome👋</Text>
                        </View>
                    </ImageBackground>
                    <SafeAreaView style={{flex:1, backgroundColor:"white"}}  edges={["left","right","bottom"]}>
                            <View className="px-6 py-1 flex-1 bg-white">
                                <KeyboardAwareScrollView enableOnAndroid={true}  keyboardShouldPersistTaps='handled' style={{flex:1}} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-xl">Email</Text>
                                        <TouchableOpacity  onPress={() => emailRef.current?.focus()} className={`mt-2 border-2 w-full gap-2  rounded-full flex flex-row justify-start items-center outline-none ${focusField.email?" border-blue-500":"border-transparent"}`}   style={{ backgroundColor: 'rgba(227, 242, 253, 0.2)', paddingHorizontal: scale(19), paddingVertical:verticalScale(4)}}>
                                            <Mail size={20} strokeWidth={2} strokeOpaci ty={0.5}/>
                                            <TextInput
                                                ref={emailRef}
                                                onFocus={prev=> setFocusField({...prev,email:true})}
                                                onBlur={prev=> setFocusField({...prev,email:false})}
                                                placeholder='Enter email'
                                                placeholderTextColor="gray"
                                                className="text-md font-semibold flex-1 text-black outline-none"
                                            />
                                        </TouchableOpacity>
                                        <Text className="mt-4 font-semibold text-xl">Password</Text>
                                        <TouchableOpacity  onPress={() => passwordRef.current?.focus()} className={`mt-2 w-full border-2 gap-2  rounded-full flex flex-row justify-start items-center outline-none ${focusField.password?" border-blue-500":"border-transparent"}`}   style={{ backgroundColor: 'rgba(227, 242, 253, 0.2)', paddingHorizontal: scale(19), paddingVertical:verticalScale(4)}}>
                                            <LockKeyhole size={20} strokeWidth={2} strokeOpacity={0.5}/>
                                            <TextInput
                                                secureTextEntry={!visible}
                                                ref={passwordRef}
                                                onFocus={prev=> setFocusField({...prev,password:true})}
                                                onBlur={prev=> setFocusField({...prev,password:false})}
                                                placeholder='Enter Password'
                                                placeholderTextColor="gray"
                                                className="text-md font-semibold flex-1 text-black outline-none"
                                            />

                                        {visible? <TouchableOpacity onPress={() => setVisible(!visible)} activeOpacity={0.5}><Eye size={18} strokeWidth={2} strokeOpacity={0.5}/></TouchableOpacity> : <TouchableOpacity onPress={() => setVisible(!visible)} activeOpacity={0.5}><EyeOff size={18} strokeWidth={2} strokeOpacity={0.5}/></TouchableOpacity>}

                                        </TouchableOpacity>

                                        <Pressable  onPress={() => setLoginSuccess(true)} className="w-full active:opacity-80 bg-[#0286FF] mt-8 rounded-full flex items-center justify-center" style={{height:verticalScale(38)}}>
                                            <Text className="text-lg font-semibold text-white" >Sign in</Text>
                                        </Pressable>
                                        
                                        <View className="w-full flex flex-row gap-3 mt-6 items-center">
                                            <View className="w-full border border-gray-200 flex-1"></View>
                                            <Text className="font-semibold text-xl tracking-wide">Or</Text>
                                            <View className="w-full border border-gray-200 flex-1"></View>
                                        </View>
                                        <Pressable className="mt-5 w-full border border-gray-200 opacity-80 flex flex-row rounded-full items-center justify-center gap-3" style={{paddingHorizontal:scale(7), paddingVertical:verticalScale(14)}}>
                                            <Image source={require("../../assets/images/search.png")} className="w-6 h-6"/>
                                            <Text className="font-semibold text-lg">Log In with Google</Text>
                                        </Pressable>
                                        <View className="flex flex-row gap-1 w-full justify-center items-center mt-8">
                                            <Text className="text-xl font-medium text-gray-500 tracking-wide">{"Don't"} have an account?</Text>
                                            <Text onPress={() => router.push("/auth/sign-up")} className="text-blue-500 active:opacity-65 text-lg font-semibold">Sign up</Text>
                                        </View>
                                    </View>
                                </KeyboardAwareScrollView>
                            </View>
                          
                    </SafeAreaView>
                    <Modal visible={loginSuccess} animationType='slide' transparent onRequestClose={() => setLoginSuccess(false)}>
                        <View className="flex-1 justify-center bg-black/40 items-center px-3">
                            <View className="w-full flex items-center rounded-2xl py-10 px-4 bg-white">
                                <Image source={require("../../assets/images/check.png")} style={{width:70, height:70}}/>
                                <Text className="mt-8 font-semibold text-2xl tracking-wider">Verified!</Text>
                                <Text className="text-center text-lg text-neutral-400 mt-4">{"You have successfully verified \nyour account"}</Text>
                                <Pressable onPress={() => setLoginSuccess(false)} className="flex items-center justify-center bg-blue-500 mt-8 w-full py-4 rounded-full  active:opacity-70">
                                    <Text className="text-md font-semibold text-white tracking-wider">Browse Home</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                   
                </View>

            
            )        
        }
        export default SignIn
