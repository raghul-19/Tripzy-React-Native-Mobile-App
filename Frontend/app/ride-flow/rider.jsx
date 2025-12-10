

import BottomSheet, { BottomSheetScrollView} from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { scale, verticalScale } from 'react-native-size-matters'
import { drivers } from '../dataSet'
import DriverCard from '../Fragments/driver-card'
import { calculateDriverFares, calculateFare,convertMinutes,getRealDrivingDistance, getTravelTimeMinutes } from '../utils/helpers'
import MapComponent from '../Fragments/map-view'
import { MoveLeft } from 'lucide-react-native'

  const Rider = () => {

    const snapPoints = useMemo(() => ["35%", "50%", "90%"], []);
    const sheetRef=useRef(null);
    const [disabled,setDisabled]=useState(true);
    const [selectedRider,setSelectedRider]=useState(null);
    const [loading,setLoading]=useState(false);
    const [location,setLocation]=useState({
      source:{
          name:"",
          coords:{latitude:null,longitude:null}
      },
      destination:{
          name:"",
          coords:{latitude:null,longitude:null}
      },
    })
    
    const params=useLocalSearchParams();
    const [fares,setFares]=useState([]);
    const router=useRouter();

    useEffect(() => {
      if(selectedRider) {
        setDisabled(false);
        console.log(selectedRider);
      } else {
        setDisabled(true);
      }
    },[selectedRider])

    useEffect(() => {
      if(params.source && params.destination) {
          const source=JSON.parse(params.source);
          const destination=JSON.parse(params.destination);
          setLocation({source:source,destination:destination});
          const getBasicInfo=async () => {
            const dist=await getRealDrivingDistance(source.coords,destination.coords);
            const baseFare=calculateFare(dist);
            setFares(calculateDriverFares(baseFare));
          }
          getBasicInfo(); 
          console.log(source);
          console.log(destination);
      }

      if(params?.selectedRider) {
        setSelectedRider(JSON.parse(params.selectedRider));
      }

    },[])
    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);
    
    const handleProceedToBooking=async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve,1000));
      const minutes=await getTravelTimeMinutes(location.source.coords,location.destination.coords);
      setLoading(false);
      router.push({
        pathname:"/ride-flow/book-ride",
        params:{
          source:JSON.stringify(location.source),
          destination:JSON.stringify(location.destination),
          selectedRider:JSON.stringify({...selectedRider,duration:convertMinutes(minutes)})
        }
      })
      
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
          <View className="flex-1 relative">
            <MapComponent userCoordinates={location.source.coords} destination={location.destination.coords} selectedRider={selectedRider}/>
            <View style={{width:"100%",position:"absolute",zIndex:2000,top:60,paddingHorizontal:scale(16)}} className="">
              <View className="flex flex-row justify-start items-center gap-4">
                <Pressable onPress={() => router.replace({
                  pathname:"/ride-flow/destination",
                  params:{
                    source:JSON.stringify(location.source),
                    destination:JSON.stringify(location.destination)
                  }
                })} style={{width:40,height:40,backgroundColor:"white",borderRadius:"100%"}} className="flex justify-center items-center active:opacity-40">
                  <MoveLeft size={20}/>
                </Pressable>
                <Text className="text-2xl font-semibold tracking-wide">Choose a Rider</Text>
              </View>
            </View>
          </View>
          <BottomSheet
              index={1}
              ref={sheetRef}
              containerStyle={{zIndex:3000}}
              keyboardBehavior='extend'
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              backgroundStyle={{ backgroundColor: "white" }}
              handleIndicatorStyle={{width:80,height:4,backgroundColor:"gray",borderRadius:8}}
          >
                  <BottomSheetScrollView 
                  contentContainerStyle={{paddingBottom:16}} 
                  style={{backgroundColor:"white"}}
                  enableContentPanningGesture={true}
                  enableHandlePanningGesture={true}
                  >
                    {drivers.map((driver,index) => {
                      return (
                        <DriverCard key={index} driver={driver} index={index} fare={fares[index]} setSelectedRider={setSelectedRider} selectedRider={selectedRider}/>
                      )

                    })}
                    <View style={{paddingHorizontal:scale(15),paddingVertical:verticalScale(10)}}>
                      <Pressable onPress={() => handleProceedToBooking()} disabled={disabled} className="mt-4 rounded-full  active:opacity-70 shadow-lg flex justify-center items-center" style={{width:"100%",height:50,backgroundColor:`${disabled?"#93C5FD":"#0286FF"}`,elevation:6,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.15,shadowRadius: 5}}>
                        {loading?<ActivityIndicator size="small" color='white'/>:<Text className="text-white font-medium tracking-wide text-lg">Select Ride</Text>}
                      </Pressable>
                    </View>
                  </BottomSheetScrollView>
          </BottomSheet>
      </GestureHandlerRootView>
    )
  }

  export default Rider
