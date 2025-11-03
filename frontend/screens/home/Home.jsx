// screens/home/Home.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ShipmentCard from '../../components/ShipmentCard';
import Chip from '../../components/Chip';
import { colors, spacing } from '../../theme';

import PlaceShipment from './PlaceShipment';
import LiveTrack from './LiveTrack';
import CheckDriver from './CheckDriver';
import Profile from './Profile';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../../context/AppContext'; // if you have it; safe even if user comes from storage

const KEY_USER = '@user';
const Tab = createBottomTabNavigator();

function Dashboard({ navigation }) {
  const { shipments = [], fetchShipments } = useApp?.() || {};
  const [filter, setFilter] = useState('All');
  const [firstName, setFirstName] = useState('there');

  // Load user's name from storage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_USER);
        if (raw) {
          const u = JSON.parse(raw);
          const candidate = (u?.user_name || u?.name || u?.email || 'there').toString();
          setFirstName(candidate.split(' ')[0]);
        }
      } catch {
        setFirstName('there');
      }
    })();
  }, []);

  // Refresh shipments when screen focuses
  useFocusEffect(
    useCallback(() => {
      if (typeof fetchShipments === 'function') fetchShipments();
    }, [fetchShipments])
  );

  const chips = ['All', 'Pending', 'In-Transit', 'To Receive', 'Received', 'Canceled'];
  const items = useMemo(
    () => (filter === 'All' ? shipments : shipments.filter(s => s.status === filter)),
    [shipments, filter]
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Greeting header ABOVE the banner */}
      <View style={styles.header}>
        <Text style={styles.hello}>Hi, {firstName}</Text>
        <Text style={styles.sub}>Quickly send, track, or check your delivery status.</Text>
      </View>

      {/* Banner image */}
      <Image
        source={require('../../../assets/banner-placeholder.png')}
        style={styles.banner}
      />

      {/* Content pushed a little further down, like the mock */}
      <View style={styles.content}>
        <Text style={styles.h1}>Dashboard</Text>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          {chips.map(c => (
            <Chip key={c} label={c} active={filter === c} onPress={() => setFilter(c)} />
          ))}
        </ScrollView>

        {/* Shipment cards */}
        {items.map(item => (
          <ShipmentCard
            key={item.id}
            data={item}
            onDetails={() => navigation.navigate('ShipmentDetails', { id: item.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { height: 64 },
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'home-outline',
            Place: 'cube-outline',
            Live: 'navigate-outline',
            CheckDriver: 'car-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={map[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Place" component={PlaceShipment} options={{ title: 'Place Shipment' }} />
      <Tab.Screen name="CheckDriver" component={CheckDriver} options={{ title: 'Check Driver' }} />
      <Tab.Screen name="Live" component={LiveTrack} options={{ title: 'Live Track' }} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  hello: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray700,
    marginBottom: 6,
  },
  sub: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.gray600,
  },
  banner: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    marginTop: spacing(1),
  },
  content: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
  },
  h1: { fontSize: 18, fontWeight: '800', marginBottom: 6, color: colors.text },
});
