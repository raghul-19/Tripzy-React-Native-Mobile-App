import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {
  return (
    <Stack screenOptions={{headerShown:false,freezeOnBlur:false}}>
        <Stack.Screen name="destination"/>
        <Stack.Screen name="rider"/>
        <Stack.Screen name="book-ride"/>
    </Stack>
  )
}

export default Layout
