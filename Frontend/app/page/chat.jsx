

import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import AuthenticationContext from '../Context/auth-context'
import Layout from '../Fragments/layout'
import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const Chat = () => {

  const router=useRouter();
  const {signOut}=useAuth();

  const handleLogOut=async () => {
    await signOut();
    router.replace("/auth/sign-in");
  }

  return (
    <AuthenticationContext>
      <Layout>
        <ScrollView style={{flex:1}}  contentContainerStyle={{flexGrow:1,paddingBottom:100}} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          <View className="flex-1 pt-5 pb-2">
            <View className="flex flex-row gap-2 justify-between items-center">
              <Text className="flex-1 font-semibold tracking-wide" style={{fontSize:22}}  numberOfLines={1}>Chat List</Text>
              <Pressable onPress={handleLogOut} className="active:opacity-45 flex justify-center items-center" style={{width:40,height:40,borderRadius:20, backgroundColor:"white"}}>
                <Image source={require("../../assets/icons/out.png")} resizeMode='contain' style={{width:20,height:20}}/>
              </Pressable>
            </View>
            <View className="flex-1 items-center justify-center">
              <Image source={require("../../assets/images/message.png")} style={{width:300,height:300,resizeMode:"contain"}}/>
              <Text className="font-bold tracking-wider" style={{fontSize:30}}>No Messages, yet.</Text>
              <Text className="mt-4 text-xl font-medium tracking-widde text-neutral-400">No messages in your inbox, yet!</Text>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </AuthenticationContext>
  )
}

export default Chat
