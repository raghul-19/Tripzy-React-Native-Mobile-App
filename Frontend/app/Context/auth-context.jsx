
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { View, Dimensions} from 'react-native'
import { apiCalls } from '../utils/apiCalls';
import LottieView from 'lottie-react-native';


const AuthenticationContext=({children}) => {

    const {isSignedIn,signOut,getToken}=useAuth();
    const router=useRouter();
    const [loading,setLoading]=useState(true);
    const { width } = Dimensions.get('window');

    useEffect(() => {
        const handleSessionAndTokenCheck=async () => {
            await new Promise(resolve => setTimeout(resolve,2000));
            try {
                if(!isSignedIn) {
                    throw new Error("Session Expired");
                } 
                const token=await getToken({template:"id_token"});
                await apiCalls.verifyJWTTokenValidity({token});
            } catch(error) {
                console.log(error.message);
                if(isSignedIn) {await signOut();}
                router.replace("/auth/sign-in");
            }
            setLoading(false);
        }
        handleSessionAndTokenCheck();
    },[])

    return (
        <>
            {
                loading
                ?
               <View className="flex-1 justify-center items-center bg-[#D3D3D3]">
                <LottieView
                    source={{uri:'https://lottie.host/37274831-5f15-44a7-81e5-26c6eaee8a94/f8aDMvFBVv.lottie'}}
                    autoPlay
                    loop
                    speed={3}
                    style={{
                        width: width * 0.5,   // 50% of screen width
                        height: width * 0.5,  // keep square
                    }}
              
                />
               </View>
                :
                <>{children}</>
            }
        </>
    )
}

export default AuthenticationContext;