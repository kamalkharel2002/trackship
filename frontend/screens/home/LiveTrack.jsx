import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme';

export default function LiveTrack(){
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:colors.white}}>
      <Text>Live Track (placeholder for map view)</Text>
    </View>
  );
}
