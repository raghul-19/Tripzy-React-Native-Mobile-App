import { IndianRupee } from 'lucide-react-native'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'

const ConfirmRideCard = ({source,destination,selectedRider}) => {
  return (
    <View className="flex" style={{marginTop:35}}>
        <View className="flex flex-row justify-center">
            <View className="rounded-full" style={{width:100,height:100,backgroundColor:"gray"}}>
            <Image source={selectedRider.image} style={{width:"100%",height:"100%",borderRadius:9999}}/>
            </View>
        </View>
        <View className="flex flex-row w-full justify-center items-center gap-2" style={{marginTop:10}}>
            <Text className="font-semibold tracking-wide" style={{fontSize:20}}>{selectedRider.name}</Text>
            <View className="flex flex-row items-center gap-1">
            <Image source={require("../../assets/icons/star.png")} style={{width:20,height:20}}/>
            <Text className="text-lg font-semibold">{selectedRider.ratings}</Text>
            </View>
        </View>
        <View className="flex rounded-2xl" style={{width:"100%",backgroundColor:"#E6F3FF",marginTop:15,paddingHorizontal:scale(14)}}>
            <View className="flex flex-row justify-between border-b border-white items-center" style={{paddingVertical:verticalScale(14)}}>
            <Text className="text-lg font-medium tracking-wide">Ride Price</Text>
            <View className="flex flex-row items-center">
                <IndianRupee size={14} strokeWidth={3} color="#0CC25F"/>
                <Text className="text-lg font-semibold" style={{color:"#0CC25F"}}>{selectedRider.fare}</Text>
            </View>
            </View>
            <View className="flex flex-row justify-between border-b border-white items-center" style={{paddingVertical:verticalScale(14)}}>
            <Text className="text-lg font-medium tracking-wide">Pickup Time</Text>
            <Text className="text-lg font-semibold">{selectedRider.time} Min</Text>
            </View>
            <View className="flex flex-row justify-between border-b border-white items-center" style={{paddingVertical:verticalScale(14)}}>
            <Text className="text-lg font-medium tracking-wide">Travel Duration</Text>
            <Text className="text-lg font-semibold">{selectedRider.duration}</Text>
            </View>
            <View className="flex flex-row justify-between items-center" style={{paddingVertical:verticalScale(14)}}>
            <Text className="text-lg font-medium tracking-wide">Car seats</Text>
            <Text className="text-lg font-semibold">4</Text>
            </View>
        </View>
        <View className="w-full flex flex-row gap-3 items-center"  style={{paddingVertical:verticalScale(10),borderColor:"#EBEBEB",borderTopWidth:1,borderBottomWidth:1,marginTop:20}}>
            <Image style={{width:25,height:25}} source={require("../../assets/icons/to.png")}/>
            <Text className="text-lg font-semibold tracking-wide flex-1" numberOfLines={1}>{source}</Text>
        </View>
        <View className="w-full flex flex-row gap-3 items-center"  style={{paddingVertical:verticalScale(10),borderColor:"#EBEBEB",borderBottomWidth:1}}>
            <Image style={{width:25,height:25}} source={require("../../assets/icons/location.png")}/>
            <Text className="text-lg font-semibold tracking-wide flex-1" numberOfLines={1}>{destination}</Text>
        </View>
    </View>
  )
}

export default ConfirmRideCard
