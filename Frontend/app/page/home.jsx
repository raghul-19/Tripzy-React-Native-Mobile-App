
import React, { useEffect,useState } from 'react'
import { Alert, AppState, FlatList, Image, Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import AuthenticationContext from '../Context/auth-context'
import Layout from '../Fragments/layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values';
import { scale, verticalScale } from 'react-native-size-matters'
import * as Location from 'expo-location'
import * as IntentLauncher from 'expo-intent-launcher'
import {ChevronRight} from 'lucide-react-native'
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps'


const Home = () => {

  const [userData,setUserData]=useState({});
  const [location,setLocation]=useState("");
  const [places,setPlaces]=useState([]);
  const [locationPermission,setLocationPermission]=useState(false);
  const [userLocation,setUserLocation]=useState({
    latitude:null,
    longitude:null
  });

  const defaultCoordinates={
    latitude: 37.78825,
    longitude: -122.4324,
  }

  const [enableLocationSuggestion,setEnableLocationSuggestion]=useState(true);

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
    if(location==="") {
      setPlaces([]);
      return;
    };
    const handleFetchLocation=async () => {
      const apiKey=process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&key=${apiKey}`;
      if(userLocation.latitude && userLocation.longitude) {
        url = url + `&location=${userLocation.latitude},${userLocation.longitude}&radius=50000`;
      }
      try {
        const response=await fetch(url);
        const result=await response.json();
        if(result.status==="OK") {
          setPlaces(result.predictions);
          console.log(result.predictions);
        } else {
          console.log("there is something went wrong");
        }
      } catch(error) {
        console.log(error.message);
        console.error("Something went wrong");
      }

    }
    handleFetchLocation();
  },[location])

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
      if(locationEnabled) {
        const pos=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
        setUserLocation({
          latitude:pos.coords.latitude,
          longitude:pos.coords.longitude
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
      checkForLocation();
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

  const customMapStyle = [
    // Hide most icons (shops, parks etc)
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
  
    // Land/background — very pale blue
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f4faff" }]
    },
  
    // Buildings/Business POIs — subtle blue
    {
      featureType: "poi.business",
      elementType: "geometry",
      stylers: [{ color: "#e3f0ff" }]
    },
  
    // Water
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#cce6ff" }]
    },
  
    // Roads — white and clean
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
  
    // Minor roads — white as well
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
  
    // Road labels (street names) — medium gray
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7a7a7a" }]
    },
  
    // Remove administrative/political noise
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ visibility: "off" }]
    },
  
    // Parks — no green, subtle fill
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#eaf6ff" }]
    },
  
    // Shop/Place Names — darker gray for readability
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#686868" }, { visibility: "on" }]
    }
  ];
  

  return (
    <AuthenticationContext>
      <Layout>
       <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View className="flex-1 pt-5 pb-2">
          <View className="flex flex-row gap-2 justify-between items-center">
            <Text className="flex-1 font-semibold tracking-wide" style={{fontSize:22}}  numberOfLines={1}>Welcome {`${userData.fname}`}</Text>
            <Pressable className="active:opacity-45 flex justify-center items-center" style={{width:40,height:40,borderRadius:20, backgroundColor:"white"}}>
              <Image source={require("../../assets/icons/out.png")} resizeMode='contain' style={{width:20,height:20}}/>
            </Pressable>
          </View>

          <View className="relative">
            <Pressable className="mt-5 w-full bg-white flex flex-row items-center justify-start gap-3 relative rounded-full border border-gray-200" style={{paddingHorizontal:scale(12),paddingVertical:verticalScale(2)}}>
              <Image source={require("../../assets/icons/search.png")} resizeMode="contain" style={{width:25,height:25}} />
              <TextInput value={location} onChangeText={(text) => setLocation(text)} className={`flex-1  text-lg ${location?"font-medium":"font-light tracking-wider"}`} placeholder='Where do you want to go?' placeholderTextColor="#aaa"/>
            </Pressable>
            {places.length!==0 &&
              <View  style={{width:"100%",height:"auto",position:"absolute",zIndex:999,top:75,backgroundColor:"white"}}>
              <FlatList
                keyboardShouldPersistTaps='handled'
                className="border-b border-white"
                data={places.filter(item => item && item.description && item.place_id)}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item,index}) => {
                  const lastSuggestion=index===places.length-1;
                  return(
                  <Pressable  className={`bg-white active:opacity-45 rounded-full ${!lastSuggestion?"border-b-2 border-gray-200":"border-b-0"}`} style={{paddingHorizontal:scale(10),paddingVertical:verticalScale(12)}}>
                    <Text className="text-md font-medium flex-1" numberOfLines={1}>{item.description}</Text>
                  </Pressable>
                )}}
              />
              </View>
            }
          </View>

          <Text className="mt-6 font-bold text-xl tracking-wide">Your current location</Text>
          <View className="mt-5 bg-white rounded-2xl" style={{width:"100%",height:300}}>
            <MapView 
              customMapStyle={customMapStyle}
              style={{width:"100%", height:"100%",borderRadius:10}}
              region={
                userLocation ?
                  {
                    ...userLocation,
                    latitudeDelta:0.004,
                    longitudeDelta:0.004,
                  }
                :
                  {
                    ...defaultCoordinates,
                    latitudeDelta:0.01,
                    longitudeDelta:0.01,
                  }
              }
            >
              <Marker coordinate={userLocation} pinColor="blue"></Marker>

            </MapView>
          </View>

          {(enableLocationSuggestion &&  userLocation.latitude===null) && 
          <View className="mt-10 relative">
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
            <View className="absolute w-[16px] h-[16px] bg-neutral-900 rotate-45 -top-2 right-4" style={{zIndex:200}}/>
          </View>}
        </View>
        </ScrollView>
      </Layout>
    </AuthenticationContext>
  )
}

export default Home;
