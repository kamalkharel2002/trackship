import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../theme';
import { useApp } from '../../context/AppContext';

export default function LiveTrack({ route, navigation }) {
  const idParam = route?.params?.id;
  const { shipments } = useApp?.() ?? { shipments: [] };

  const shipment = useMemo(
    () => (Array.isArray(shipments) ? shipments.find(s => s.id === idParam) : null),
    [shipments, idParam]
  );

  const id = shipment?.id ?? idParam ?? 'AB1234XY78';
  const dest = shipment?.to ?? 'Bus Booking, Thimphu';
  const transporter = shipment?.transporter ?? 'Pema Bidha';

  const fallbackA = { latitude: 27.4728, longitude: 89.6390 }; 
  const fallbackB = { latitude: 27.4712, longitude: 89.6515 }; 

  // If your shipment carries coords, use them—else the fallbacks
  const start = {
    latitude: Number(shipment?.fromLat) || fallbackA.latitude,
    longitude: Number(shipment?.fromLng) || fallbackA.longitude,
  };
  const end = {
    latitude: Number(shipment?.toLat) || fallbackB.latitude,
    longitude: Number(shipment?.toLng) || fallbackB.longitude,
  };

  const routeCoords = [
    start,
    // a gentle bend to make the line feel “road-like”
    { latitude: (start.latitude + end.latitude) / 2 + 0.0015, longitude: (start.longitude + end.longitude) / 2 - 0.002 },
    end,
  ];

  const initialRegion = {
    latitude: (start.latitude + end.latitude) / 2,
    longitude: (start.longitude + end.longitude) / 2,
    latitudeDelta: Math.abs(start.latitude - end.latitude) + 0.01,
    longitudeDelta: Math.abs(start.longitude - end.longitude) + 0.01,
  };

  const mapRef = useRef(null);

  useEffect(() => {
    // Smoothly fit the route into view
    if (mapRef.current) {
      // small timeout to ensure map is ready
      setTimeout(() => {
        try {
          mapRef.current.fitToCoordinates(routeCoords, {
            edgePadding: { top: 80, right: 40, bottom: 260, left: 40 }, // leave space for the bottom sheet
            animated: true,
          });
        } catch {}
      }, 250);
    }
  }, [shipment?.id]); // re-fit when shipment changes

  return (
    <View style={styles.screen}>
      {/* Live Map */}
     <View style={{ flex: 1 }}>
  <MapView
    ref={mapRef}
    provider={PROVIDER_GOOGLE}
    style={StyleSheet.absoluteFillObject}
    initialRegion={initialRegion}
    showsUserLocation
    showsMyLocationButton={false}
    pitchEnabled
    rotateEnabled={false}
    toolbarEnabled={false}
    loadingEnabled
    loadingIndicatorColor={colors.primary}
    customMapStyle={MAP_STYLE_SOFT}
  >
    {/* Only map elements allowed here */}
    <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#55B96B" />
    <Marker coordinate={start} title="Origin">
      <View style={styles.pinBubble}>
        <Ionicons name="cube-outline" size={14} color={colors.white} />
      </View>
    </Marker>
    <Marker coordinate={end} title="Destination" description={dest}>
      <View style={[styles.pinBubble, { backgroundColor: colors.primary }]}>
        <Ionicons name="flag-outline" size={14} color={colors.white} />
      </View>
    </Marker>
  </MapView>

  {/* overlays: OUTSIDE map */}
  <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backBtn}>
    <Ionicons name="chevron-back" size={22} color={colors.white} />
  </TouchableOpacity>

  <View style={styles.topRight}>
    <View style={styles.circleIcon}>
      <Ionicons name="snow-outline" size={18} color={colors.white} />
    </View>
    <View style={[styles.circleIcon, { marginLeft: 10 }]}>
      <Ionicons
        name="navigate-outline"
        size={18}
        color={colors.white}
        onPress={() => {
          mapRef.current?.fitToCoordinates(routeCoords, {
            edgePadding: { top: 80, right: 40, bottom: 260, left: 40 },
            animated: true,
          });
        }}
      />
    </View>
  </View>
</View>
      <View style={styles.sheet}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="cube-outline" size={22} color={colors.primary} />
          <View style={{ marginLeft: spacing(1) }}>
            <Text style={styles.kicker}>Shipment Number</Text>
            <Text style={styles.strong}>{id}</Text>
          </View>
        </View>

        <View style={styles.hr} />

        <Text style={styles.sectionTitleLink}>Delivering to</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="location-outline" size={16} color={colors.gray700} />
          <Text style={styles.bodyText}>  {dest}</Text>
        </View>

        <View style={styles.hr} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.kicker}>Transporter</Text>
            <Text style={styles.strong}>{transporter}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.contactBtn} onPress={() => { /* wire dialer later */ }}>
            <Ionicons name="call-outline" size={18} color={colors.primary} />
            <Text style={styles.contactTxt}>  Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const SHEET_RADIUS = 18;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  map: { flex: 1 },

  backBtn: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59,130,246,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  topRight: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
  },
  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(33,37,41,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinBubble: {
    backgroundColor: '#55B96B',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },

  sheet: {
    position: 'absolute',
    left: spacing(2),
    right: spacing(2),
    bottom: spacing(2),
    backgroundColor: colors.white,
    borderRadius: SHEET_RADIUS,
    padding: spacing(1.5),
    borderWidth: 1,
    borderColor: '#D9E5F7',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  kicker: {
    color: colors.gray600,
    fontSize: 13,
    marginBottom: 2,
  },
  strong: {
    fontWeight: '800',
    color: colors.gray900,
    fontSize: 16,
  },
  hr: {
    height: 1,
    backgroundColor: '#E9EEF6',
    marginVertical: spacing(1.25),
  },
  sectionTitleLink: {
    fontWeight: '800',
    color: colors.primary,
  },
  bodyText: {
    color: colors.gray800,
    fontWeight: '600',
  },
  contactBtn: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactTxt: {
    color: colors.primary,
    fontWeight: '800',
  },
});

// Soft, low-contrast look to match your palette
const MAP_STYLE_SOFT = [
  { elementType: 'geometry', stylers: [{ color: '#f5f7fb' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#637186' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8591a6' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#f1f4fa' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e6ecf7' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e8f0fb' }] },
];
