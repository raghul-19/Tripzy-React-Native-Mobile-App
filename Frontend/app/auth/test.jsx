import React, { useState } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';

export default function Testing() {
  const [visible, setVisible] = useState(false);
  

  return (
    <View style={{ flex: 1 , alignItems:"center",justifyContent:"center"}}>
      {/* Open button */}
      <Pressable onPress={() =>{ setVisible(true); console.log("testing")}} className="text-white bg-blue-500 px-3 active:opacity-60 py-3">
        <Text style={{ color: 'white', fontSize: 16 }}>Open Modal</Text>
      </Pressable>
      <Modal visible={visible} transparent className="bg-black/40" style={{flex:1, justifyContent:"center", alignItems:"center"}}></Modal>
    </View>
  );
}

