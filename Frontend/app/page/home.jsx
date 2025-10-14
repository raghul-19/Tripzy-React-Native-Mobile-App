

import React from 'react'
import { Text, View } from 'react-native'
import AuthenticationContext from '../Context/auth-context'

const Home = () => {


 

  return (
    <AuthenticationContext>
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-blue-500">Just Typical Home Page</Text>
      </View>
    </AuthenticationContext>
  )
}

export default Home
