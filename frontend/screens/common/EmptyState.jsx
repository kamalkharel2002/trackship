import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme';
export default function EmptyState({ title='No items yet' }){
  return <View style={{padding:24, alignItems:'center'}}><Text style={{color:colors.gray700}}>{title}</Text></View>;
}
