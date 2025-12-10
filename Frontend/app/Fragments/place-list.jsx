
import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters';

const PlaceList = ({location,userLocation,setSelectedPlaces,closeKeyboard}) => {
  
  const [places,setPlaces]=useState([]);
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
        console.log(result);
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

  return (
    <>
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
            <Pressable onPress={() => {setSelectedPlaces(item.description); closeKeyboard()}}  className={`bg-white active:opacity-45 rounded-full ${!lastSuggestion?"border-b-2 border-gray-200":"border-b-0"}`} style={{paddingHorizontal:scale(10),paddingVertical:verticalScale(12)}}>
              <Text className="text-md font-medium flex-1" numberOfLines={1}>{item.description}</Text>
            </Pressable>
          )}}
        />
        </View>
      }
    </>
  )
}

export default PlaceList
