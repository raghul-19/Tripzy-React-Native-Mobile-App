import { useOAuth, useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldAlert, User } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Image, ImageBackground, Modal, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View , ActivityIndicator} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser"
import Verify from '../Fragments/verify';
import * as Linking from 'expo-linking';


WebBrowser.maybeCompleteAuthSession();

const SignUp = () => {

  useWarmUpBrowser();
  const [focusField,setFocusField]=useState({
    name:false,
    email:false,
    password:false,
  });
  const {isLoaded,signUp,setActive}=useSignUp();
  const {startOAuthFlow}=useOAuth({strategy:"oauth_google"});
  const [signupSuccess,setSignupSuccess]=useState(false);
  const [visible,setVisible]=useState(false);
  const nameRef=useRef(null);
  const emailRef=useRef(null);
  const passwordRef=useRef(null);
  const router=useRouter();
  const [userDetails,setUserDetails]=useState({
    name:"",
    email:"",
    password:"",
  })
  const [loading,setLoading]=useState({
    signIn:false,
    oAuth:false,
  });
  const [disabled,setDisabled]=useState(true);
  const [error,setError]=useState("");
  useEffect(() => {
    if(userDetails.name.trim() && userDetails.email.trim() && userDetails.password.trim() && !loading.oAuth) {
      setDisabled(false);     
    } else {
      setDisabled(true)
    }
  },[userDetails,loading])



  const handleSignUp=async () => {
    setLoading(prev => ({...prev,signIn:true}));
    await new Promise(resolve => setTimeout(resolve,2000));
    try {
      if(!isLoaded) return;

      await signUp.create({
        emailAddress:userDetails.email,
        password:userDetails.password,
        firstName:userDetails.name,
      
      })
      await signUp.prepareEmailAddressVerification({strategy:"email_code"})
      setError("");
      setSignupSuccess(true);

    } catch(error) {
      console.log(error.message);
      if(error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((e) => setError(e.message));
      } else {
        setError("Network error");
      }
    }
    setLoading(prev => ({...prev,signIn:false}));
  }

  const handleOtpVerification=async (code) => {
    const otpVerification=await signUp.attemptEmailAddressVerification({code});
    if(otpVerification.status==="complete") {
      await setActive({session:otpVerification.createdSessionId});
    } else {
      throw new Error("Something went wrong and try again!");
    }
  }

  const handleResendOtp=async () => {
    await signUp.prepareEmailAddressVerification({strategy:"email_code"});
  }

  const OauthSignIn=async () => {
    setLoading(prev => ({...prev,oAuth:true}));
    await new Promise(resolve => setTimeout(resolve,2000));
    try {
      const {createdSessionId,setActive}=await startOAuthFlow({redirectUrl:Linking.createURL('auth/sign-up')});
      if(createdSessionId) {
        await setActive({session:createdSessionId});
        setError("");
        router.replace("/auth/account-sync");
      } else {
        setError("Sign in with google failed and try again!");
      }
      
    } catch(error) {
        if(error.errors[0]) {
          setError(error.errors[0].message);
        } else {
          setError("Network error");
        }
    }
    setLoading(prev => ({...prev,oAuth:false}));
    
  }

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
                    value={userDetails.name}
                    onChangeText={(text) => setUserDetails(prev => ({...prev,name:text}))}
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
                    value={userDetails.email}
                    onChangeText={(text) => setUserDetails(prev => ({...prev,email:text}))}
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
                    value={userDetails.password}
                    onChangeText={(text) => setUserDetails(prev => ({...prev,password:text}))}
                    secureTextEntry={!visible}
                  />
                  {visible?<Eye onPress={() => setVisible(!visible)} size={18} strokeWidth={2} strokeOpacity={0.5}/>:<EyeOff onPress={() => setVisible(!visible)} size={18} strokeWidth={2} strokeOpacity={0.5}/>}
                </TouchableOpacity>
                <Pressable disabled={disabled}  onPress={handleSignUp} className="w-full active:opacity-80 disabled:bg-blue-200 bg-[#0286FF] mt-8 rounded-full flex items-center justify-center" style={{height:verticalScale(38)}}>
                  {loading.signIn ?<ActivityIndicator size="small" color='white'/>:<Text className="text-lg font-semibold text-white">Sign up</Text>}
                </Pressable>
                {error && 
                  <View className="w-full bg-red-300/60 mt-5 overflow-scroll rounded-md gap-3 shadow-md flex flex-row items-center justify-start" style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(9)}}>
                    <ShieldAlert size={14} color={"red"}/>
                    <Text numberOfLines={1}  className="flex-1 text-sm text-red-500 font-semibold">{error}</Text>
                  </View>
                }
                <View className="mt-6 flex w-full flex-row gap-3 items-center">
                  <View className="flex-1 w-full border border-gray-200"></View>
                  <Text className="font-semibold text-xl tracking-wide">Or</Text>
                  <View className="w-full flex-1 border border-gray-200"></View>
                </View>
                <Pressable onPress={OauthSignIn}  className="mt-5 w-full border border-gray-200 opacity-80 flex flex-row rounded-full items-center justify-center gap-3" style={{paddingHorizontal:scale(7), paddingVertical:verticalScale(14)}}>
                  <Image  source={require("../../assets/images/search.png")} className="w-6 h-6"/>
                  {loading.oAuth?<ActivityIndicator size="small" color='black'/>:<Text className="font-semibold text-lg">Log In with Google</Text>}
                </Pressable>
                <View className="flex flex-row gap-1 w-full justify-center items-center mt-8">
                  <Text className="text-xl font-medium text-gray-500 tracking-wide">Already have an account?</Text>
                  <Text onPress={() => router.push("/auth/sign-in")} className="text-blue-500 active:opacity-65 text-lg font-semibold">Sign in</Text>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        
      </SafeAreaView>

      {signupSuccess && <Verify visible={signupSuccess} onClose={setSignupSuccess} handleOtpVerification={handleOtpVerification} handleResendOtp={handleResendOtp} isSignIn={false}/>}

    </View>
  )
}

export default SignUp
