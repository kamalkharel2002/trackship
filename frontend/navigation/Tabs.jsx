import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/app/Home';
import PlaceShipment from '../screens/app/PlaceShipment';
import Track from '../screens/app/Track';
import CheckDriver from '../screens/home/CheckDriver';
import Profile from '../screens/app/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { height: 64, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          const map = { Home: 'home', 'Place Shipment': 'cube', Track: 'map', Profile: 'person' };
          return <Ionicons name={map[route.name]} color={color} size={size} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Place Shipment" component={PlaceShipment} />
      <Tab.Screen name="Track" component={Track} />
      <Tab.Screen name="Live Track" component={LiveTrack} />
      <Tab.Screen name="Check Driver" component={CheckDriver} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
