

import React from 'react'
import { Text, View } from 'react-native'
import AuthenticationContext from '../Context/auth-context'
import Layout from '../Fragments/layout'

const History = () => {


 

  return (
    <AuthenticationContext>
      <Layout>
        <View className="flex-1 justify-center items-center">
          <Text className="text-blue-500 text-lg">History Page</Text>
        </View>
      </Layout>
    </AuthenticationContext>
  )
}

export default History
