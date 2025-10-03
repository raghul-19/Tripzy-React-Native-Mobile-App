import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import "../global.css";
import Provider from '../src/Components/provider'
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'


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
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Provider>
        <Stack screenOptions={{headerShown:false}}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="splash"/>
          <Stack.Screen name="page"/>
          <Stack.Screen name="auth"/>
          <Stack.Screen name="oauth-native-callback"/>
        </Stack>
      </Provider>
    </ClerkProvider>
  )
}
