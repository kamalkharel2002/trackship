import React from 'react';
import { View, Text } from 'react-native';
import TopBar from '../../components/TopBar';

export default function Track() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopBar title="Track" />
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#475569' }}>Tracking list will be implemented here.</Text>
      </View>
    </View>
  );
}
