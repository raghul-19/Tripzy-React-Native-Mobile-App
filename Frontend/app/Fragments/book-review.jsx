import React from 'react'
import { Image, Text, View } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'

const BookReview = ({source,destination,selectedRider}) => {
  return (
    <>
        <View className="flex" style={{paddingTop:20,paddingBottom:verticalScale(15),borderColor:"#EBEBEB",borderTopWidth:1,borderBottomWidth:1,marginTop:20}}>
            <View className="flex flex-row items-center justify-between rounded-2xl" style={{width:"100%",paddingVertical:verticalScale(10),paddingHorizontal:scale(14),backgroundColor:"#E6F3FF"}}>
                <View className="flex-1  gap-2 items-center">
                <View style={{width:80,height:80,borderRadius:9999,backgroundColor:"red"}}>
                    <Image style={{width:"100%",height:"100%",borderRadius:9999}} source={selectedRider.image}/>
                </View>
                <Text className="font-semibold text-lg" style={{flexShrink:1}} numberOfLines={1}>{selectedRider.name}</Text>
                </View>
                <View className="flex-1 justify-center items-center">
                <Image style={{width:120,height:120,resizeMode:"contain"}} source={require("../../assets/images/car2.png")}/>
                </View>
            </View>
            <View className="flex flex-row items-center justify-start w-full gap-3" style={{marginTop:15}}>
                <Image style={{width:25,height:25}} source={require("../../assets/icons/to.png")}/>
                <Text className="text-lg font-semibold tracking-wide flex-1" numberOfLines={1}>{source}</Text>
            </View>
        </View>
        <View className="flex flex-row items-center justify-start w-full gap-3" style={{marginTop:15}}>
            <Image style={{width:25,height:25}} source={require("../../assets/icons/location.png")}/>
            <Text className="text-lg font-semibold tracking-wide flex-1" numberOfLines={1}>{destination}</Text>
        </View>
    </>
  )
}

export default BookReview
