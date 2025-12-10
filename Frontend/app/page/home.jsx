
import React, { useEffect,useState } from 'react'
import { Alert, AppState, Image, Keyboard, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import AuthenticationContext from '../Context/auth-context'
import Layout from '../Fragments/layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values';
import { scale, verticalScale } from 'react-native-size-matters'
import * as Location from 'expo-location'
import * as IntentLauncher from 'expo-intent-launcher'
import {ChevronRight} from 'lucide-react-native'
import RideLayout from '../Fragments/ride-layout'
import { useRouter } from 'expo-router'
import MapComponent from '../Fragments/map-view'
import PlaceList from '../Fragments/place-list'
import { coordinatesToName, nameToCoordinates } from '../utils/helpers'
import { useAuth } from '@clerk/clerk-expo'
import { apiCalls } from '../utils/apiCalls'

const Home = () => {

  const [userData,setUserData]=useState({});
  const [location,setLocation]=useState("");
  const router=useRouter();
  const [locationPermission,setLocationPermission]=useState(false);
  const [userLocation,setUserLocation]=useState({
    latitude:null,
    longitude:null
  });  
  const {getToken,signOut}=useAuth();
  const [recentRide,setRecentRide]=useState({});
  const [selectedDestinaton,setSelectedDestination]=useState("");
  const [enableLocationSuggestion,setEnableLocationSuggestion]=useState(true);


  useEffect(() => {
    if(!selectedDestinaton.trim()) return;
    const handleFinalStepsToRideFlow=async () => {
      const destinationCoordinates=await nameToCoordinates(selectedDestinaton);
      const sourceLocationName=(userLocation.latitude && userLocation.longitude)?await coordinatesToName(userLocation):"";
      const source={name:sourceLocationName,coords:userLocation};
      const destination={name:selectedDestinaton,coords:destinationCoordinates};
      router.push({
        pathname:"/ride-flow/destination",
        params:{
          source:JSON.stringify(source),
          destination:JSON.stringify(destination)
        }
      })
      setLocation("");
      return;
    }
    handleFinalStepsToRideFlow();
  },[selectedDestinaton])

  useEffect(() => {
    const handleFetchRecentRide=async () => {
      try {
        const {email}=JSON.parse(await AsyncStorage.getItem("user"));
        const token=await getToken({template:"id_token"});
        const response=await apiCalls.getRecentRideData(email,token);
        console.log(response.data);
        setRecentRide(response.data);
      } catch(err) {
        console.log(err.message);
      }
    }
    handleFetchRecentRide();
  },[])

  useEffect(() => {
    const handleUserLocation=async () => {
      let {status,canAskAgain}=await Location.requestForegroundPermissionsAsync();
      if(status==="granted") {
        setLocationPermission(true);
        checkForLocation();
        return;
      }

      if(status !=='granted' && canAskAgain) {
        Alert.alert(
          "Location Required",
          "We need your location to show nearby rides. Please allow access.",
          [
            {
              text:"Try again",
              onPress:() => handleUserLocation()
            }, {
              text:"Cancel",
              style:"cancel"
            }
          ]
        );
        return;
      }

      Alert.alert(
        "Enable location in settings",
        "You've permanently denied location access. Please enable it manually in Settings to use location features.",
        [
          {
            text:"Open settings",
            onPress:() => Linking.openSettings(),
          },
          {
            text:"Cancel",
            style:"cancel"
          }
        ]
      )
      
    }

    handleUserLocation();
  },[])

  useEffect(() => {
    let trackUserLocation;
    (async () => {
      trackUserLocation=await Location.watchPositionAsync(
        {
          accuracy:Location.Accuracy.Highest,
          timeInterval:5000,
          distanceInterval:1000,
        },
        (location) => {
          setUserLocation({
            latitude:location.coords.latitude,
            longitude:location.coords.longitude
          })
        }
      );
    })();
    return () => trackUserLocation && trackUserLocation.remove();
  },[])

  useEffect(() => {
    const handleUserDataFetch=async () => {
      try {
        const user=await AsyncStorage.getItem("user");
        if(user) {
          setUserData(JSON.parse(user));
          return;
        }
        throw new Error("User data not found");
      } catch(error) {
        console.log(error.message);
      }
    }
    console.log(process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY);
    handleUserDataFetch();
  },[])


  useEffect(() => {
    const trackAppState=AppState.addEventListener('change',(nextAppState) => {
      if(nextAppState==='active') {
        checkPermissions();
      }
    })
    return () => trackAppState.remove();
  })


  useEffect(() => {
    const trackLocationStatus=async () => {
      const locationEnabled=await Location.hasServicesEnabledAsync();
      if(!locationEnabled) {
        setUserLocation(
          {
            latitude:null,
            longitude:null
          }
        )
        return;
      }

      if(userLocation.latitude===null && userLocation.longitude===null) {
        const pos=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
        setUserLocation({
          latitude:pos.coords.latitude,
          longitude:pos.coords.longitude,
        })
      }
    }
    const timeInterval=setInterval(trackLocationStatus,3000);
    return () => clearInterval(timeInterval);
  })

  const checkPermissions=async () => {
    const {status}=await Location.getForegroundPermissionsAsync();
    if(status==='granted') {
      setLocationPermission(true);
      if(userLocation.latitude===null){checkForLocation();}
    }
  }

  const checkForLocation=async () => {
    try {
      const locationEnabled=await Location.hasServicesEnabledAsync();
      if(!locationEnabled) {
        Alert.alert(
          "Location Required",
          "Please turn it on the location to find you near by rides!",
          [
            {
              text:"Open Settings",
              onPress:() => IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS)
            },
            {
              text:"No, thanks",
              style:"cancel"
            }
          ]
        )
        return;
      }
      const pos=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
      setUserLocation({
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude,
      })
    } catch(error) {
      console.log(error.message);
      Alert.alert(
        "Location Required",
        "Please turn on the location to get you near by rides!",
        [{
          text:"ok"
        }]
      )
    }
  }
  const handleLogOut=async () => {
    await signOut();
    router.replace("/auth/sign-in");
  }

   return (
    <AuthenticationContext>
      <Layout>
       <ScrollView style={{flex:1}}  contentContainerStyle={{flexGrow:1,paddingBottom:100}} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View className="flex-1 pt-5 pb-2 relative">
          <View className="flex flex-row gap-2 justify-between items-center">
            <Text className="flex-1 font-semibold tracking-wide" style={{fontSize:22}}  numberOfLines={1}>Welcome {`${userData.fname}`}</Text>
            <Pressable onPress={handleLogOut} className="active:opacity-45 flex justify-center items-center" style={{width:40,height:40,borderRadius:20, backgroundColor:"white"}}>
              <Image source={require("../../assets/icons/out.png")} resizeMode='contain' style={{width:20,height:20}}/>
            </Pressable>
          </View>

          <View className="relative">
            <Pressable className="mt-5 w-full bg-white flex flex-row items-center justify-start gap-3 relative rounded-full border border-gray-200" style={{paddingHorizontal:scale(12),paddingVertical:verticalScale(2)}}>
              <Image source={require("../../assets/icons/search.png")} resizeMode="contain" style={{width:25,height:25}} />
              <TextInput value={location} onChangeText={(text) => setLocation(text)} className={`flex-1  text-lg ${location?"font-medium":"font-light tracking-wider"}`} placeholder='Where do you want to go?' placeholderTextColor="#aaa"/>
            </Pressable>
            {location.length!==0 && 
              <PlaceList closeKeyboard={() => Keyboard.dismiss()} location={location} userLocation={userLocation} setSelectedPlaces={(selectedDestinaton) => setSelectedDestination(selectedDestinaton)}/>
            }
          </View>

          <Text className="mt-6 font-bold text-xl tracking-wide">Your current location</Text>
          <View className="mt-5 bg-white rounded-xl overflow-hidden" style={{width:"100%",height:300}}>
            
              <MapComponent userCoordinates={userLocation}/>

          </View>

          
          <View className="mt-10 relative">
            {enableLocationSuggestion && userLocation.latitude===null && 
            <>
            <View className="w-full rounded-lg bg-neutral-900" style={{position:"relative",paddingHorizontal:scale(15),paddingVertical:verticalScale(15)}}>
              <Text className="text-white font-medium text-sm tracking-wide">{(!locationPermission)?"Please grant location acccess permission for":"Please turn on or update your location for"}</Text>
              <Text className="text-white font-medium text-sm tracking-wide mt-1">accessing services around you.</Text>
              <View className="flex flex-row gap-4 justify-end items-center mt-4">
                <Pressable onPress={() => setEnableLocationSuggestion(false)} className="active:opacity-55">
                  <Text className="text-white font-semibold text-md">Cancel</Text>
                </Pressable>
                <Pressable onPress={() => (locationPermission) ? IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS): Linking.openSettings()} className="active:opacity-55 flex gap-2 flex-row items-center">
                  <Text className="font-semibold text-md text-orange-500">Turn on</Text>
                  <View className="w-4 h-4 bg-orange-500 rounded-full flex justify-center items-center">
                    <ChevronRight color={"white"} size={12} strokeWidth={3}/>
                  </View>
                </Pressable>
              </View>
            </View>
            <View className="absolute w-[16px] h-[16px] bg-neutral-900 rotate-45 -top-2 right-4"/>
            </>}
            <Text className="mt-5 font-bold tracking-wide" style={{fontSize:18}}>Recent Rides</Text>
            <View className="mt-5">
              {recentRide?.name?<RideLayout ride={recentRide}/>:
                <View className="flex items-center">
                  <Image source={require("../../assets/images/no-result.png")} style={{width:200,height:200}}/>
                  <Text className="text-xl font-semibold ">No result found</Text>
                </View>
              }
            </View>
          </View>
        </View>
        </ScrollView>
      </Layout>
    </AuthenticationContext>
  )
}

export default Home;
