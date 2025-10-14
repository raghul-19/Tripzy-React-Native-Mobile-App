import { useRouter } from "expo-router";
import { useEffect} from "react";
import { Image, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen=() => {

  const router=useRouter();

  useEffect(() => {
    handleNavigation();
  },[])

  const handleNavigation=async () => {
    await new Promise(resolve => setTimeout(resolve,2000));
    try {
      const userStatus=await AsyncStorage.getItem("userStatus");
      if(userStatus!==null) {
        router.replace("/page/home");
        return;
      } 
      await AsyncStorage.setItem("userStatus","true");
      router.replace("/auth/welcome");
    } catch(error) {
      console.log(error.message);
      router.replace("/auth/sign-in");
    }
  }
  return (
    <View className="flex-1">
      <Image source={require("../assets/images/splash.png")} style={{width:"100%", height:"100%"}} resizeMode='cover'/>
    </View>
  )
}

export default SplashScreen