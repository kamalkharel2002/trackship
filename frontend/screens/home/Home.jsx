import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ShipmentCard from '../../components/ShipmentCard';
import Chip from '../../components/Chip';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme';
import PlaceShipment from './PlaceShipment';
import LiveTrack from './LiveTrack';
import CheckDriver from './CheckDriver';
import Profile from './Profile';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const Tab = createBottomTabNavigator();



function Dashboard({ navigation }) {
  const { shipments, fetchShipments } = useApp();
  const [filter, setFilter] = useState('All');

  // refresh list whenever this tab gains focus
  useFocusEffect(
    useCallback(() => {
      fetchShipments?.();
    }, [fetchShipments])
  );

  const chips = ['All','Pending','In-Transit','To Receive','Received','Canceled'];
  const items = useMemo(() => filter==='All' ? shipments : shipments.filter(s => s.status===filter), [shipments, filter]);

  return (
    <ScrollView style={{flex:1, backgroundColor:colors.white}}>
      {/* Banner */}
      <Image source={require('../../../assets/banner-placeholder.png')} style={{width:'100%', height:140, resizeMode:'cover'}} />

      <View style={{paddingHorizontal:spacing(2), paddingTop:spacing(1)}}>
        <Text style={styles.h1}>Dashboard</Text>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:8}}>
          {chips.map(c => <Chip key={c} label={c} active={filter===c} onPress={()=>setFilter(c)} />)}
        </ScrollView>

        {/* Cards list */}
        {items.map(item => (
          <ShipmentCard key={item.id} data={item} onDetails={()=>navigation.navigate('ShipmentDetails', { id:item.id })} />
        ))}
      </View>
    </ScrollView>
  );
}

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({route})=>({
        headerShown:false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle:{ height:64 },
        tabBarIcon: ({color, size}) => {
          const map = { Home:'home-outline', Place:'cube-outline', Live:'navigate-outline', Profile:'person-outline' };
          return <Ionicons name={map[route.name] || 'ellipse-outline'} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Place" component={PlaceShipment} options={{ title:'Place Shipment' }} />
      <Tab.Screen name="CheckDriver" component={CheckDriver} options={{ title:'Check Driver' }} />
      <Tab.Screen name="Live" component={LiveTrack} options={{ title:'Live Track' }} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  h1:{ fontSize:18, fontWeight:'800', marginBottom:6, color:colors.text },
});
