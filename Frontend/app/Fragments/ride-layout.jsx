import React from 'react'
import { Text , View, Image} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { formatCreatedAt } from '../utils/helpers';

const RideLayout = ({ride}) => {
  return (
    <View className="rounded-xl bg-white w-full" style={{paddingVertical:verticalScale(12),paddingHorizontal:scale(12)}}>
      <View className="flex flex-row gap-3">
        <View className="rounded-xl bg-gray-300" style={{width:100,height:110}}>
          <Image source={require("../../assets/images/map.jpeg")} style={{width:"100%",height:"100%",resizeMode:"cover",borderRadius:10}}/>
        </View>
        <View className="flex-1 justify-center gap-4">
           <View className="flex flex-row gap-2 w-full items-center">
            <Image style={{width:25,height:25}} source={require("../../assets/icons/to.png")}/>
            <Text className="flex-1 tracking-wide text-md font-medium" ellipsizeMode='tail' numberOfLines={1}>{ride.sourceName}</Text>
          </View>
          <View className="flex flex-row gap-2 w-full items-center">
            <Image style={{width:25,height:25}} source={require("../../assets/icons/location.png")}/>
            <Text className="flex-1 text-md tracking-wide font-medium" ellipsizeMode='tail' numberOfLines={1}>{ride.destinationName}</Text>
          </View>
        </View>
      </View>
      <View  className="rounded-xl  mt-3 bg-[#F6F8FA] gap-4" style={{width:"100%",paddingHorizontal:scale(12),paddingVertical:verticalScale(14)}}>
        <View className="flex flex-row w-full gap-3 justify-between items-center">
          <Text className="text-lg font-medium" style={{color:"#6B7280"}}>Date & Time</Text>
          <Text className="text-lg   font-semibold" numberOfLines={1} style={{flexShrink:1}}>{formatCreatedAt(ride.createdAt)}</Text>
        </View>
        <View className="flex flex-row w-full gap-3 justify-between items-center">
          <Text className="text-lg font-medium" style={{color:"#6B7280"}}>Driver</Text>
          <Text className="text-lg  font-semibold" numberOfLines={1} style={{flexShrink:1}}>{ride.name}</Text>
        </View>
        <View className="flex flex-row w-full gap-3 justify-between items-center">
          <Text className="text-lg font-medium" style={{color:"#6B7280"}}>Car seats</Text>
          <Text className="text-lg  font-semibold" numberOfLines={1} style={{flexShrink:1}}>4</Text>
        </View>
        <View className="flex flex-row w-full gap-3 justify-between items-center">
          <Text className="text-lg font-medium" style={{color:"#6B7280"}}>Payment Status</Text>
          <Text className="text-lg  font-semibold" numberOfLines={1} style={{color:"#0CC25F",flexShrink:1}}>Paid</Text>
        </View>
      </View>
    </View>
  )
}

export default RideLayout;
