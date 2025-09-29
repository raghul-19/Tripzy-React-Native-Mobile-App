import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import "../global.css";
import Provider from '../src/Components/provider'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    const holdSplashScreen= async () => {
      await new Promise(resolve => setTimeout(resolve,2000));
      SplashScreen.hideAsync();
    }

    holdSplashScreen();

  },[])

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#fff");
    
  })
  return (
    <Provider>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="splash"/>
        <Stack.Screen name="page"/>
        <Stack.Screen name="auth"/>
      </Stack>
    </Provider>
  )
}
