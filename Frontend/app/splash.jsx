import { useRouter } from "expo-router";
import { useEffect} from "react";
import { Image, View } from "react-native";

const SplashScreen=() => {

  const router=useRouter();

  useEffect(() => {
    
    const timeout=setTimeout(() => {
      router.replace("/auth/sign-in");
    },2000);
    return () => clearTimeout(timeout);
  },[])
  return (
    <View className="flex-1">
      <Image source={require("../assets/images/splash.png")} style={{width:"100%", height:"100%"}} resizeMode='cover'/>
    </View>
  )
}

export default SplashScreen