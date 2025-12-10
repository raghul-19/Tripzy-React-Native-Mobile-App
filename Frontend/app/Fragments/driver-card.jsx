

import { IndianRupee } from 'lucide-react-native';
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const DriverCard = ({driver,index,fare=0,setSelectedRider,selectedRider}) => {
  return (
    <Pressable onPress={() => setSelectedRider({...driver,fare:fare})} className="active:opacity-30">
    <View style={{width:"100%",paddingHorizontal:scale(15),backgroundColor:`${selectedRider?.name===driver.name?"#EDF6FF":"white"}`}}>
        <View className={`flex flex-row  ${index===5?"border-transparent":"border-b"} border-gray-200`}style={{width:"100%",paddingVertical:verticalScale(20)}}>
          <View className="flex-1  flex-row gap-3">
            <View className="rounded-full" style={{width:60,height:60,backgroundColor:"gray"}}>
              <Image style={{width:"100%",height:"100%",borderRadius:9999}} source={driver.image}/>
            </View>
            <View className="flex-1">
              <View className="flex-1 flex-row gap-2 items-center">
                <Text className="text-lg font-semibold" style={{flexShrink:1}} numberOfLines={1}>{driver.name}</Text>
                <View className="flex flex-row gap-1 items-center">
                  <Image source={require("../../assets/icons/star.png")} style={{width:20,height:20}}/>
                  <Text className="font-medium tracking-wide">{driver.ratings}</Text>
                </View>
              </View>
              <View className="flex-1  flex-row items-start">
                <View style={{flexShrink:1}} className="flex-row gap-1  items-center">
                  <Image source={require("../../assets/icons/rupee.png")} style={{width:18,height:18}}/>
                  <View style={{flexShrink:1}} className="flex-row items-center">
                    <IndianRupee size={12} strokeWidth={3}/>
                    <Text className="text-md font-semibold" style={{flexShrink:1}} numberOfLines={1}>{fare}</Text>
                  </View>
                </View>
                <View style={{ width: 1, height: 16, backgroundColor: '#9CA3AF', marginHorizontal: 4 }} />
                <Text className="text-md font-medium" style={{color:"#858585"}}>{driver.time} min</Text>
                <View style={{ width: 1, height: 16, backgroundColor: '#9CA3AF', marginHorizontal: 4 }} />
                <Text className="text-md font-medium" style={{color:"#858585"}}>4 seats</Text>
              </View>
            </View>
          </View>
          <View className="flex items-center justify-center">
            <Image style={{width:60,height:60,resizeMode:"contain"}} source={require("../../assets/images/car.png")}/>
          </View>
        </View>
    </View>
    </Pressable>
  )
}

export default DriverCard;
