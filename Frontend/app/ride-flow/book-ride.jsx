import BottomSheet, { BottomSheetScrollView} from '@gorhom/bottom-sheet'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ConfirmRideCard from '../Fragments/confirm-ride-card'
import { useLocalSearchParams, useRouter } from 'expo-router'
import MapComponent from '../Fragments/map-view'
import {MoveLeft, ShieldAlert } from 'lucide-react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import { useAuth } from '@clerk/clerk-expo'
import { apiCalls } from '../utils/apiCalls'
import {useStripe} from '@stripe/stripe-react-native'
import BookReview from '../Fragments/book-review'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { generateRideDetails } from '../utils/helpers'


const FinalBooking = () => {
  const snapPoints = useMemo(() => ["35%", "50%", "90%"], []);
  const sheetRef = useRef(null);
  const [loading,setLoading]=useState(false);
  const {initPaymentSheet,presentPaymentSheet}=useStripe();
  const {getToken}=useAuth();
  const [errorMessage,setErrorMessage]=useState("");
  const [review,setReview]=useState(false);
  const [bookingPlaced,setBookingPlaced]=useState(false);
  const [location,setLocation]=useState({
    source:{
        name:"",
        coords:{latitude:null,longitude:null}
    },
    destination:{
        name:"",
        coords:{latitude:null,longitude:null}
    },
  });
  const [selectedRider,setSelectedRider]=useState({});
  const params=useLocalSearchParams();
  const router=useRouter();

  useEffect(() => {
    if(params.source && params.destination && params.selectedRider) {
      setLocation({source:JSON.parse(params.source),destination:JSON.parse(params.destination)});
      setSelectedRider(JSON.parse(params.selectedRider));
      return;
    }
  },[])

  
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleRideRgistration=async (token) => {
    const {email}=JSON.parse(await AsyncStorage.getItem("user"));
    const rideDetails=generateRideDetails(location,selectedRider,email);
    const rideResponse=await apiCalls.registerRideDetails(rideDetails,token);
    console.log(rideResponse.data);
    return;
  }

  const handlePayment=async () => {
    console.log("testing");
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve,1000));
    try {
      const token=await getToken({template:"id_token"});
      const {data}=await apiCalls.getClientPaymentSecret({amount:selectedRider.fare,currency:"inr"},token);
      const {error}=await initPaymentSheet({
        paymentIntentClientSecret:data.secretKey,
        merchantDisplayName:"Tripzy App For Ride Booking"
      });
      if(error) throw new Error("Something went wrong, Try again!");
      const result=await presentPaymentSheet();
      if(result?.error) throw new Error("Payment cancelled, Try again!");
      console.log("success");
      setErrorMessage("");
      await handleRideRgistration(token);
      sheetRef.current?.close();
      setBookingPlaced(true);
    } catch(err) {
      if(err?.response?.data.message) {
        setErrorMessage(err.response.data.message);
      } else { 
        setErrorMessage(err.message);
      }
      console.log(err.message);
    }
    setLoading(false);
  }

  return (
      <GestureHandlerRootView style={{flex:1}}>
        <View className="flex-1 relative">
          <Modal  visible={bookingPlaced} animationType='slide'  transparent style={{zIndex:3000}}>
            <View className="flex-1 justify-center bg-black/40" style={{paddingHorizontal:scale(10)}}>
            <View className="rounded-2xl" style={{paddingVertical:verticalScale(30),paddingHorizontal:scale(15),backgroundColor:"white"}}>
              <View className="flex  items-center">
                <Image source={require("../../assets/images/check.png")} style={{width:90,height:90}}/>
                <Text className="font-semibold tracking-wide" style={{marginTop:25,fontSize:25}}>Booking placed</Text>
                <Text className="font-semibold tracking-wide" style={{fontSize:25}}>successfully</Text>
                <Text className="text-md text-center font-medium mt-3 text-neutral-400">{"Thank you for your booking! Your\nreservation has been successfully\nplaced. Please proceed with your trip."}</Text>
              </View>
              <Pressable onPress={() => {setBookingPlaced(false); setReview(true); sheetRef.current.expand()}} className="rounded-full  active:opacity-70 shadow-lg flex justify-center items-center" style={{marginTop:40,width:"100%",height:50,backgroundColor:"#0286FF",elevation:6,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.15,shadowRadius: 5}}>
                {loading?<ActivityIndicator size="small" color='white'/>:<Text className="text-white font-semibold tracking-wide text-lg">Go Track</Text>}
              </Pressable>
              <Pressable onPress={() => router.replace("/page/home")} className="rounded-full  active:opacity-70 shadow-lg flex justify-center items-center" style={{marginTop:15,width:"100%",height:50,backgroundColor:"#F6F8FA",elevation:6,shadowOffset: { width: 0, height: 2 },}}>
                {loading?<ActivityIndicator size="small" color='white'/>:<Text className="text-black font-semibold tracking-wide text-lg">Back Home</Text>}
              </Pressable>
            </View>
            </View>
          </Modal>
          <MapComponent userCoordinates={location.source.coords} destination={location.destination.coords} selectedRider={selectedRider}/>
          <View style={{width:"100%",position:"absolute",zIndex:1000,top:60,paddingHorizontal:scale(16)}} className="">
              <View className="flex flex-row justify-start items-center gap-4">
                <Pressable onPress={() => router.replace({
                  pathname:"/ride-flow/rider",
                  params:{
                    source:JSON.stringify(location.source),
                    destination:JSON.stringify(location.destination),
                    selectedRider:JSON.stringify(selectedRider)
                  }
                })} style={{width:40,height:40,backgroundColor:"white",borderRadius:"100%"}} className="flex justify-center items-center active:opacity-40">
                  <MoveLeft size={20}/>
                </Pressable>
                <Text className="text-2xl font-semibold tracking-wide">Book a Rider</Text>
              </View>
            </View>
        </View>
        <BottomSheet
        index={3}
        ref={sheetRef}
        containerStyle={{zIndex:2000}}
        keyboardBehavior='extend'
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{width:80,height:4,backgroundColor:"gray",borderRadius:8,zIndex:2000}}
      >
        <BottomSheetScrollView 
          contentContainerStyle={{paddingBottom:16}} 
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          style={{ paddingHorizontal:20, paddingVertical:10}}
        >
         { !review && <>
          <Text className="text-2xl font-semibold tracking-wide">Ride Information</Text>
          <ConfirmRideCard source={location.source.name} destination={location.destination.name} selectedRider={selectedRider}/>
          <Pressable onPress={handlePayment} className="rounded-full  active:opacity-70 shadow-lg flex justify-center items-center" style={{marginTop:40,width:"100%",height:50,backgroundColor:"#0286FF",elevation:6,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.15,shadowRadius: 5}}>
            {loading?<ActivityIndicator size="small" color='white'/>:<Text className="text-white font-medium tracking-wide text-lg">Book Now</Text>}
          </Pressable>
          {errorMessage && 
            <View className="w-full bg-red-300/60 mt-5 overflow-scroll rounded-md gap-3 shadow-md flex flex-row items-center justify-start" style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(9)}}>
                <ShieldAlert size={14} color={"red"}/>
                <Text numberOfLines={1}  className="flex-1 text-sm text-red-500 font-semibold">{errorMessage}</Text>
            </View>
          }
          </>}
          {review && <>

          <Text className="text-2xl font-semibold tracking-wide">Arriving in <Text style={{color:"#0CC25F"}}>10 Mins</Text></Text>
          <BookReview source={location.source.name} destination={location.destination.name} selectedRider={selectedRider}/>
          <Pressable onPress={() => router.replace("/page/home")} className="rounded-full  active:opacity-70 shadow-lg flex justify-center items-center" style={{marginTop:40,width:"100%",height:50,backgroundColor:"#0286FF",elevation:6,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.15,shadowRadius: 5}}>
            <Text className="text-white font-medium tracking-wide text-lg">Back Home</Text>
          </Pressable>
          </>}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  )
}

export default FinalBooking
