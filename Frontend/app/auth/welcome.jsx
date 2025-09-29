  import React, { useEffect, useRef, useState } from 'react'
  import { Dimensions, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
  import { SafeAreaView } from 'react-native-safe-area-context'
  import Swiper from 'react-native-swiper'
  import { welcomPageDataSet } from '../dataSet'
import { useRouter } from 'expo-router'

  const Welcome = () => {
    const slideRef=useRef(null);
    const [activeIndex,setActiveIndex]=useState(0);
    const router=useRouter();

    useEffect(() => {
      if(activeIndex>=3) {
        router.push("/auth/start");
        setActiveIndex(2);
      }
    },[activeIndex])

    return (
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
          <View className="flex-1  bg-white">
            <View className="flex-1">
              <View  className="w-full flex flex-row justify-end mt-3 p-5">
                <Text onPress={() => router.push("/auth/start")} className="text-md font-semibold">Skip</Text>
              </View>
              <View className="flex-1 overflow-hidden mt-8">
                <Swiper 
                  ref={slideRef}
                  index={activeIndex}
                  loop={false}
                  dot={<View className="w-8 h-1  rounded-full mx-1 bg-gray-200"/>}
                  activeDot={<View className="w-8  h-1 rounded-full mx-1 bg-blue-500"/>}
                  scrollEnabled={false}
                  onIndexChanged={(index) => setActiveIndex(index)}
                
                >
                  {welcomPageDataSet.map((data,index) => {
                    const words=data.title.split(" ");
                    const lastword=words.pop();
                    const rest=words.join(" ");
                    return (
                      <View style={{flex:1, paddingHorizontal:20, alignItems:"center",  overflow:"hidden"}}  key={index}>
                        <Image 
                          style={{width:"100%", height:301}}
                          source={data.image}
                          resizeMode='cover'
                        />
                        <Text className="text-center text-black mt-10 tracking-wide font-semibold leading-snug text-3xl">{rest}{" "}<Text className={`${lastword.toLowerCase()==="ryde"?"text-blue-500":""}`}>{lastword}</Text></Text>
                        <Text className="mt-4 text-center leading-relaxed text-lg tracking-wider text-neutral-400 font-medium">{data.description}</Text>
                      </View>
                    )
                  })}
                </Swiper>
              </View>
              <View className="p-5">
                <Pressable onPress={() => slideRef.current.scrollBy(1)} className="bg-blue-500 w-full py-4 flex active:opacity-65 items-center justify-center text-center rounded-full shadow-md">
                  <Text className="text-lg font-semibold text-white">Next</Text>
                </Pressable>
              </View>
            </View>
          </View>
      </SafeAreaView> 
    )
  }

  export default Welcome