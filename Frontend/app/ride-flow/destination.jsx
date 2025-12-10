import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import {Keyboard, Pressable, Text, TextInput,View} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { scale, verticalScale } from 'react-native-size-matters';
import { LocateFixed, Map, MapPin, MoveLeft, ShieldAlert } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PlaceList from '../Fragments/place-list';
import { nameToCoordinates } from '../utils/helpers';
import MapComponent from '../Fragments/map-view';

const Destination = () => {
  const snapPoints = useMemo(() => ["35%", "50%", "90%"], []);
  const sheetRef = useRef(null);
  const router=useRouter();
  const [focusField,setFocusField]=useState({
    source:false,
    destination:false
  })

  const [isKeyboardOpen,setIsKeybordOpen]=useState(false);
  const[disabled,setDisabled]=useState(true);
  const params=useLocalSearchParams();
  const [location,setLocation]=useState({
    source:{
      name:"",
      coords:{latitude:null,longitude:null}
    },
    destination:{
      name:"",
      coords:{latitude:null,longitude:null}
    }
  })
  const [showSuggesstion,setShowSuggestions]=useState({
    source:false,
    destination:false,
  })

  const [error,setError]=useState({
    source:"",
    destination:"",
  })

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    if(location.source.name.trim() && location.destination.name.trim() && !error.source.trim() && !error.destination.trim() && !isKeyboardOpen) {
        setDisabled(false);
    } else {
        setDisabled(true);
    }
  })
  useEffect(() => {
    if(params.source && params.destination) {
      setLocation({source:JSON.parse(params.source),destination:JSON.parse(params.destination)});
      console.log(params.source);
      console.log(params.destination);
      return;
    }
  },[])
  useEffect(() => {
    const keyboardShowListener=Keyboard.addListener("keyboardDidShow",() => {
        setIsKeybordOpen(true);
        sheetRef.current?.snapToIndex(3);
    })
    return () => keyboardShowListener.remove()
  },[])


  useEffect(() => {
    const handleKeyBoardListener=Keyboard.addListener("keyboardDidHide",() => {
      setIsKeybordOpen(false);
      if(focusField.source && location.source.name.trim()) {
        setShowSuggestions(prev => ({...prev,source:false}));
        updateCoordinates("source");
      } 
    })
    return () => handleKeyBoardListener.remove();
    
  },[location.source.name])

  useEffect(() => {
    const handleKeyboardListener=Keyboard.addListener("keyboardDidHide",() => {
      setIsKeybordOpen(false);
      if(focusField.destination && location.destination.name.trim()) {
        setShowSuggestions(prev => ({...prev,destination:false}))
        updateCoordinates("destination");
        return;
      }    
    })
    return () => handleKeyboardListener.remove();

  },[location.destination.name])

  const updateCoordinates=async (type) => {

    try {
      const coords=await nameToCoordinates(type==="source"?location.source.name:location.destination.name);
      if(coords) {
        setLocation(prev => 
        (type==='source')
          ?
          ({...prev,source:{...prev.source,coords:coords}})
          :
          ({...prev,destination:{...prev.destination,coords:coords}})
        )
        setError(prev => ({...prev,[type]:""}));
      } else {
        throw new Error("Something went worng while converting name to source coordinates");
      }
    } catch(error) {
      console.log(error.message);
      setError(prev => 
        ({...prev,[type]:`Enter valid ${type}`}));
    }
  }

  const handleNavigationToRiderChoose=() => {
    router.push({
      pathname:"/ride-flow/rider",
      params:{
        source:JSON.stringify(location.source),
        destination:JSON.stringify(location.destination),
      }
    })
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 relative">
        <MapComponent userCoordinates={location.source.coords} destination={location.destination.coords}/>
        <View style={{width:"100%",position:"absolute",zIndex:2000,top:60,paddingHorizontal:scale(16)}} className="">
          <View className="flex flex-row justify-start items-center gap-4">
            <Pressable onPress={() => router.replace("/page/home")} style={{width:40,height:40,backgroundColor:"white",borderRadius:"100%"}} className="flex justify-center items-center active:opacity-40">
              <MoveLeft size={20}/>
            </Pressable>
            <Text className="text-2xl font-semibold tracking-wide">Ride</Text>
          </View>
        </View>
      </View>
      <BottomSheet
        index={0}
        ref={sheetRef}
        containerStyle={{zIndex:3000}}
        keyboardBehavior='extend'
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{width:80,height:4,backgroundColor:"gray",borderRadius:8}}
      >
        <BottomSheetView style={{ paddingHorizontal:20, paddingVertical:10}}>
          <Text className="text-xl font-medium">From</Text>
          <View>
          <Pressable  
            className={`mt-3 w-full border-2 gap-2 rounded-full flex flex-row justify-start items-center outline-none ${focusField.source?"border-blue-500":"border-transparent"}`}
            style={{ backgroundColor: 'rgba(227, 242, 253, 0.2)', paddingHorizontal: scale(19), paddingVertical:verticalScale(4)}}
          >
           <MapPin size={25} strokeWidth={2} strokeOpacity={0.5}/>
            <TextInput
                onBlur={() => {setFocusField(prev => ({...prev,source:false}));setShowSuggestions(prev => ({...prev,source:false}))}} 
                onFocus={() => {setFocusField(prev =>({...prev,source:true})); setShowSuggestions(prev => ({...prev,source:true}))}}
                placeholder='From Location'
                placeholderTextColor={"#BDBDBD"}
                className="text-lg font-medium flex-1 text-black outline-none"
                value={location.source.name}
                onChangeText={(text) => setLocation(prev => ({...prev,source:{...prev.source,name:text}}))}
                numberOfLines={1}
            />
            <LocateFixed size={25} strokeWidth={2}/>

          </Pressable>
          {showSuggesstion.source && location.source.name.length>0 && 
              <PlaceList closeKeyboard={() => Keyboard.dismiss()} location={location.source.name} userLocation={location.source.coords} setSelectedPlaces={(selectedPlace) => {setLocation(prev => ({...prev,source:{...prev.source,name:selectedPlace}})); setShowSuggestions(prev => ({...prev,source:false}))}}/>
          }
          </View>
          {error.source && 
            <View className="w-full bg-red-300/60 mt-3 overflow-scroll rounded-md gap-3 shadow-md flex flex-row items-center justify-start" style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(9)}}>
              <ShieldAlert size={14} color={"red"}/>
              <Text numberOfLines={1}  className="flex-1 text-sm text-red-500 font-semibold">{error.source}</Text>
            </View>
          }
          
          <Text className="mt-4 text-xl font-medium">To</Text>
          <View className="relative">
            <Pressable  
              className={`mt-3 w-full border-2 gap-2 rounded-full flex flex-row justify-start items-center outline-none ${focusField.destination?"border-blue-500":"border-transparent"}`}
              style={{ backgroundColor: 'rgba(227, 242, 253, 0.2)', paddingHorizontal: scale(19), paddingVertical:verticalScale(4)}}
            >
            <MapPin size={25} strokeWidth={2} strokeOpacity={0.5}/>
              <TextInput
                  onBlur={() => {setFocusField(prev =>({...prev,destination:false})); setShowSuggestions(prev => ({...prev,destination:false}))}} 
                  onFocus={() => {setFocusField(prev =>({...prev,destination:true})); setShowSuggestions(prev => ({...prev,destination:true}))}}
                  placeholder='To Location'
                  placeholderTextColor={"#BDBDBD"}
                  className="text-lg font-medium flex-1 text-black outline-none"
                  value={location.destination.name}
                  onChangeText={(text) => setLocation(prev => ({...prev,destination:{...prev.destination,name:text}}))}
                  numberOfLines={1}
              />
              <Map size={25} strokeWidth={2}/>
            </Pressable>
            {showSuggesstion.destination && location.destination.name.length>0 && 
              <PlaceList closeKeyboard={() => Keyboard.dismiss()} location={location.destination.name} userLocation={location.source.coords} setSelectedPlaces={(selectedPlace) => {setLocation(prev => ({...prev,destination:{...prev.destination,name:selectedPlace}})); setShowSuggestions(prev => ({...prev,destination:false}))}}/>
            }
          </View>

          {error.destination && 
            <View className="w-full bg-red-300/60 mt-3 overflow-scroll rounded-md gap-3 shadow-md flex flex-row items-center justify-start" style={{paddingHorizontal:scale(12), paddingVertical:verticalScale(9)}}>
              <ShieldAlert size={14} color={"red"}/>
              <Text numberOfLines={1}  className="flex-1 text-sm text-red-500 font-semibold">{error.destination}</Text>
            </View>
          }
          
          <Pressable onPress={handleNavigationToRiderChoose} disabled={disabled} className="mt-4 rounded-full  active:opacity-70 shadow-lg flex justify-center items-center" style={{width:"100%",height:50,backgroundColor:`${disabled?"#93C5FD":"#1492F8"}`,elevation:6,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.15,shadowRadius: 5}}>
            <Text className="text-white font-medium tracking-wide text-lg">Find Now</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Destination;