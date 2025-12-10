

import React, { useEffect, useState } from 'react'
import { Image, Pressable, Text, View, ScrollView} from 'react-native'
import AuthenticationContext from '../Context/auth-context'
import Layout from '../Fragments/layout'
import { useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCalls } from '../utils/apiCalls'
import RideLayout from '../Fragments/ride-layout'

const History = () => {

  const router=useRouter();
  const [rides,setRides]=useState([]);
  const {getToken,signOut}=useAuth();

  useEffect(() => {
    const handleFetchRideDetails=async () => {
      try {
        const token=await getToken({template:"id_token"});
        const {email}=JSON.parse(await AsyncStorage.getItem("user"));
        const response=await apiCalls.getAllRideHistory(email,token);
        console.log(response.data);
        setRides(response.data);
      } catch(err) {
        console.log(err.message);
      }
    }
    handleFetchRideDetails();
  },[])

  const handleLogOut=async () => {
    await signOut();
    router.replace("/auth/sign-in");
  }
  
  return (
    <AuthenticationContext>
      <Layout>
        <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1,paddingBottom:100}} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          <View className="flex-1 pt-5 pb-2">
            <View className="flex flex-row gap-2 justify-between items-center">
              <Text className="flex-1 font-semibold tracking-wide" style={{fontSize:22}}  numberOfLines={1}>Ride History</Text>
              <Pressable onPress={handleLogOut} className="active:opacity-45 flex justify-center items-center" style={{width:40,height:40,borderRadius:20, backgroundColor:"white"}}>
                <Image source={require("../../assets/icons/out.png")} resizeMode='contain' style={{width:20,height:20}}/>
              </Pressable>
            </View>
            
              {
                rides.length>0
                ?
                <View className="flex gap-4" style={{marginTop:20}}>
                {rides.map((ride,index) => {
                  return (<RideLayout ride={ride} key={index}/>)
                })}
                </View>
                :
                <View className="flex-1 justify-center items-center">
                  <Image style={{width:200,height:200,resizeMode:"cover"}} source={require("../../assets/images/no-result.png")}/>
                  <Text className="text-xl font-semibold tracking-wide">No result found</Text>
                </View>
              }         
            
          </View>
        </ScrollView>
      </Layout>
    </AuthenticationContext>
  )
}

export default History
