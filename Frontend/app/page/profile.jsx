

import { useAuth, useUser } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import AuthenticationContext from '../Context/auth-context'
import Layout from '../Fragments/layout'
import { apiCalls } from '../utils/apiCalls'
import Verify from '../Fragments/verify'

const Profile = () => {

  const [userData,setUserData]=useState({});
  const router=useRouter();
  const {getToken}=useAuth();
  const {user}=useUser();
  const [verify,setVerify]=useState(false);
  const [statusPending,setStatusPending]=useState(false);
  const [image,setImage]=useState({
    uri:null,
    type:null,
    base64:null
  })
  const [loading,setLoading]=useState({
    fname:false,
    lname:false,
    email:false,
    pNumber:false,
    image:false,
  })
  const [edit,setEdit]=useState({
    fname:false,
    lname:false,
    email:false,
    pNumber:false,
    image:false
  });

  const [error,setError]=useState({
    fname:"",
    lname:"",
    email:"",
    pNumber:"",
    image:null
  });

  useEffect(() => {
    const handleUserData=async () => {
        try {
            const user=await AsyncStorage.getItem("user");
            if(user) {
                setUserData(JSON.parse(user));
                console.log(user);
            } else {
                throw new Error("User data not found?");
            }

        } catch(error) {
            console.log(error.message);
            router.replace("/auth/sign-in");
        }
    }
    handleUserData();
  },[])

  const handleEmailUpdate=async () => {
    
    setLoading(prev => ({...prev,email:true}));
    await new Promise(resolve => setTimeout(resolve,1000));
    
    
    try {
        const emailAddress=await user.emailAddresses.find((e) => e.emailAddress===userData.email);
        if(emailAddress && emailAddress.verification.status==="verified") {
            setError(prev => ({...prev,email:"Email already exist no need to update!"}));
            setStatusPending(false);
            setLoading(prev => ({...prev,email:false}));
            setEdit(prev => ({...prev,email:false}));
            
        }
        if(emailAddress && emailAddress.verification.status==='unverified') {
            await emailAddress.prepareVerification({strategy:"email_code"});
        } else {
            const updatedEmailAddress=await user.createEmailAddress({email:userData.email});
            await updatedEmailAddress.prepareVerification({strategy:"email_code"});
        }
        setError(prev => ({...prev,email:""}));
        setVerify(true);
        setLoading(prev => ({...prev,email:false}));
        setEdit(prev => ({...prev,email:false}));
        setStatusPending(true);
    } catch(error) {
        console.log(error.message);
        setStatusPending(true);
        setError(prev => ({...prev,email:"Something went wrong while updating your email!"}));
    }
  }

  const handleEmailVerification=async (code) => {
    const emailAddress=await user.emailAddresses.find((e) => e.emailAddress===userData.email);
    if(!emailAddress) throw new Error("Email not found");
    await emailAddress.attemptVerification({code});
    await user.update({primaryEmailAddressId:emailAddress.id});
    await AsyncStorage.setItem("user",JSON.stringify(userData));
    setStatusPending(false);
    
  }

  const handleResendOtp=async () => {
    const emailAddress=await user.emailAddresses.find((e) => e.emailAddress===userData.email);
    await emailAddress.prepareVerification({strategy:"email_code"});
  }
  
  const handleImagePicker=async () => {
    const {status}=await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status!=="granted") {
        setError(prev => ({...prev,image:"Permission to access storage media denied!"}));
        return;
    }
    const result=await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing:true,
        aspect:[1,1],
        quality:1,
        base64:true
    });
    if(result.canceled) {
        setError(prev =>({...prev,image:"Something went wrong! Try again!"}));
        return;
    }
    const uri=result.assets[0].uri;
    const fileName=result.assets[0].fileName || result.assets[0].uri.split("/").pop();
    const type=fileName.split(".").pop().toLowerCase();
    if(!["png","jpg","jpeg"].includes(type)) {
        setError(prev => ({...prev,image:"Please select only JPG or PNG images."}));
        return;
    } 
    setImage({
        uri:uri,
        type:type==='png'?"image/png":"image/jpeg",
        base64:result.assets[0].base64,
    });
    console.log(type);
    setEdit(prev => ({...prev,image:true}));
    setError(prev => ({...prev,image:""}));

  }
 

  const handleFieldUpdates=async (field) => {
    setLoading(prev => ({...prev,[field]:true}));
    if(!edit.image) {
        const {[field]:value}=userData;
        if(!value || !value.trim()) {
            setLoading(prev => ({...prev,[field]:false}));
            setError(prev => ({...prev,[field]:"Fill this field properly!"}));
            return;
        }
    } 
    const token=await getToken({template:"id_token"});
    const updatedUserData={
        fname:userData.fname,
        lname:userData.lname,
        pNumber:userData.pNumber,
        userId:userData.userId,
        imageType:image.type,
        encodedImage:image.base64
    }
    try {
        const response=await apiCalls.updateUserProfile(updatedUserData,token);
        await AsyncStorage.setItem("user",JSON.stringify(response.data));
        setError(prev =>({...prev,[field]:""}));
        setEdit(prev => ({...prev,[field]:false}));   
    } catch(error) {
        console.log(error.message);
        if(error.response) {
            setError(prev => ({...prev,[field]:error.response.data.message}));
        } else {
            setError(prev => ({...prev,[field]:"Network error"}));
        }
    }
    setLoading(prev => ({...prev,[field]:false}));
  }

  return (
    <AuthenticationContext>
      <Layout>
        <View className="flex-1 px-5 pt-3 pb-2">
            <Text style={{fontSize:25}} className="font-bold tracking-widest mt-3">Your profile</Text>
            <View className="w-full flex items-center mt-6">
                <View className="relative w-fit h-fit">
                    
                    <View
                        style={{
                            width:110,
                            height:110,
                            borderRadius:55,
                            backgroundColor:"white",
                            alignItems:"center",
                            justifyContent:"center",
                            overflow:"hidden",
                            elevation: 6
                    
                        }}
                    >
                        <View
                            style={{
                                width:100,
                                height:100,
                                borderRadius:50,
                                overflow:"hidden",
                            }}
                        >
                            <Image style={{width:"100%",height:"100%"}}  resizeMode='center' source={{uri:image.uri?image.uri:`data:${userData.imageType};base64,${userData.encodedImage}`}}/>
                        </View>
                    </View>
                    <Pressable className="absolute z-20 flex justify-center active:opacity-40 items-center  bg-white" style={{left:"24%", bottom:"3%",width:30, height:30,borderRadius:15}}>
                        { 
                            loading.image
                                ?
                                    <ActivityIndicator color={"#22c55e"}/>
                                :
                                edit.image
                                ?
                                <Pressable onPress={() => handleFieldUpdates("image")} className="active:opacity-40"><Image tintColor={"#22c55e"} source={require("../../assets/icons/save.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                                :   
                                <Pressable onPress={handleImagePicker} className="active:opacity-40"><Image  source={require("../../assets/icons/photo.png")} resizeMode='contain' style={{width:18,height:18}}/></Pressable>
                        }
                        
                    </Pressable>
                </View>
                { error.image &&
                    <View className="mt-3 w-full bg-red-300/60 rounded-lg" style={{paddingVertical:verticalScale(8),paddingHorizontal:scale(10)}}>
                        <Text className="text-red-700 text-sm font-semibold tracking-wide flex-1" numberOfLines={1}>{error.image}</Text>
                    </View>
                }
            </View>

            <View className="mt-8 flex-1 bg-white rounded-xl" style={{paddingVertical:verticalScale(12),paddingHorizontal:scale(12)}}>
                <Text className="text-neutral-400 font-medium text-md">First name</Text>
                <Pressable className="mt-2 w-full rounded-full bg-[#F6F8FA] flex flex-row items-center justify-between" style={{paddingHorizontal:scale(10)}}>
                    <TextInput editable={edit.fname} onChangeText={(text) => setUserData(prev => ({...prev,fname:text}))} numberOfLines={1} className="flex-1 text-lg font-medium" value={userData.fname}/>
                    {
                     loading.fname ?
                     <ActivityIndicator color='black'/>
                     :
                    edit.fname
                        ?
                        <Pressable onPress={()=> handleFieldUpdates("fname")} className="active:opacity-40"><Image source={require("../../assets/icons/save.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                        :
                        <Pressable onPress={() => setEdit(prev => ({...prev,fname:true}))} className="active:opacity-40"><Image  source={require("../../assets/icons/edit.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                    
                    }
                    
                </Pressable>
                {error.fname &&
                    <View className="mt-3">
                        <Text className="text-md text-red-700 font-semibold">{error.fname}</Text>
                    </View>
                }
                <Text className="text-neutral-400 font-medium text-md mt-4">Last name</Text>
                <Pressable className="mt-2 w-full rounded-full bg-[#F6F8FA] flex flex-row items-center justify-between" style={{paddingHorizontal:scale(10)}}>
                    <TextInput editable={edit.lname} onChangeText={(text) => setUserData(prev => ({...prev,lname:text}))} numberOfLines={1} className="flex-1 text-lg font-medium" value={userData.lname}/>
                    {
                     loading.lname ?
                     <ActivityIndicator color='black'/>
                     :
                    edit.lname
                        ?
                        <Pressable onPress={()=> handleFieldUpdates("lname")} className="active:opacity-40"><Image source={require("../../assets/icons/save.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                        :
                        <Pressable onPress={() => setEdit(prev => ({...prev,lname:true}))} className="active:opacity-40"><Image  source={require("../../assets/icons/edit.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                    
                    }
                </Pressable>
                {error.lname &&
                    <View className="mt-3">
                        <Text className="text-md text-red-700 font-semibold">{error.lname}</Text>
                    </View>
                }
                <Text className="text-neutral-400 font-medium text-md mt-4">Email</Text>
                <Pressable className="mt-2 w-full rounded-full bg-[#F6F8FA] flex flex-row items-center justify-between" style={{paddingHorizontal:scale(10)}}>
                    <TextInput editable={edit.email} numberOfLines={1} className="flex-1 text-lg font-medium" onChangeText={(text) => setUserData(prev => ({...prev,email:text}))} value={userData.email}/>
                    {
                     loading.email ?
                     <ActivityIndicator color='black'/>
                     :
                    edit.email
                        ?
                        <Pressable onPress={handleEmailUpdate} className="active:opacity-40"><Image source={require("../../assets/icons/save.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                        :
                        <Pressable onPress={() => setEdit(prev => ({...prev,email:true}))} className="active:opacity-40"><Image  source={require("../../assets/icons/edit.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                    
                    }
                </Pressable> 
                {error.email &&
                    <View className="mt-3">
                        <Text className="text-md text-red-700 font-semibold">{error.email}</Text>
                    </View>
                }
                <Text className="text-neutral-400 font-medium text-md mt-4">Email status</Text>
                <View className="w-full bg-[#F6F8FA] rounded-xl mt-2 flex justify-center items-start" style={{paddingHorizontal:scale(10),paddingVertical:verticalScale(8)}}>
                    <View className={`flex flex-row justify-center items-center ${statusPending?"bg-[#F9E7E7] border-red-700":"bg-[#E7F9EF] border-green-600"} border-2  rounded-full gap-2 `} style={{paddingHorizontal:scale(16),paddingVertical:verticalScale(5)}}>
                        {!statusPending && <Image source={require("../../assets/icons/check.png")}  tintColor={"black"} style={{width:20, height:20}}/>}
                        <Text className="text-md font-medium tracking-wide">{statusPending?"Pending ...":"Verified"}</Text>
                    </View>
                </View>
                <Text className="text-neutral-400 font-medium text-md mt-4">Phone number</Text>
                <Pressable className="mt-2 w-full rounded-full bg-[#F6F8FA] flex flex-row items-center justify-between" style={{paddingHorizontal:scale(10)}}>
                    <TextInput keyboardType='numeric' value={userData.pNumber} editable={edit.pNumber} onChangeText={(text) => setUserData(prev => ({...prev,pNumber:text}))} numberOfLines={1} className="flex-1 text-lg font-medium"/>
                    {
                     loading.pNumber ?
                     <ActivityIndicator color='black'/>
                     :
                    edit.pNumber
                        ?
                        <Pressable onPress={()=> handleFieldUpdates("pNumber")} className="active:opacity-40"><Image source={require("../../assets/icons/save.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                        :
                        <Pressable onPress={() => setEdit(prev => ({...prev,pNumber:true}))} className="active:opacity-40"><Image  source={require("../../assets/icons/edit.png")} resizeMode='contain' style={{width:20, height:20}}/></Pressable>
                    
                    }
                </Pressable>
                {error.pNumber &&
                    <View className="mt-3">
                        <Text className="text-md text-red-700 font-semibold">{error.pNumber}</Text>
                    </View>
                }
            </View>
        </View>
        
      </Layout>
      {verify && <Verify visible={verify} onClose={setVerify} handleOtpVerification={handleEmailVerification} handleResendOtp={handleResendOtp} update={true} email={userData.email}/>}
    </AuthenticationContext>
  )
}

export default Profile
