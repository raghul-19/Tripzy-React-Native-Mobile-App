
import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {

    return (
        <Stack screenOptions={{headerShown:false,freezeOnBlur:false}}>
            <Stack.Screen name="sign-in"/>
            <Stack.Screen name="sign-up"/>
            <Stack.Screen name="test"/>
            <Stack.Screen name="welcome"/>
            <Stack.Screen name="account-sync"/>
            <Stack.Screen name="start"/>
        </Stack>
    )
  
}

export default Layout;
