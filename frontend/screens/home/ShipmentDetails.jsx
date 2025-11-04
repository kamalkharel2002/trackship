import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme';

const statusColors = {
  Pending: { bg: '#FFF3D6', text: '#8B6B00' },
  InTransit: { bg: '#EAF4FF', text: '#0A68C7' },
  Delivered: { bg: '#E9F9EE', text: '#1B7F3B' },
};


export default function ShipmentDetails({ route, navigation }) {
  const { shipments } = useApp();
  const shipment = useMemo(
    () => shipments.find((s) => s.id === route.params?.id),
    [shipments, route.params]
  );


  if (!shipment) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Shipment not found</Text>
      </View>
    );
  }

  const badge = statusColors[shipment.status] || statusColors.Pending;
  const items = useMemo(() => {
    const raw = Array.isArray(shipment.items) && shipment.items.length
      ? shipment.items
      : (Array.isArray(shipment.parcels) ? shipment.parcels : []);
    return raw.map((it) => ({
      category: it.category || it.parcel_category || it.type || 'Unspecified',
      size: (it.size || '').toString(),
      desc: it.desc || it.parcel_description || it.description || '',
      fragile: !!(it.fragile ?? it.is_fragile),
    }));
  }, [shipment]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={styles.page}>

      <Text style={styles.pageTitle}>Parcel Details</Text>
      <View style={styles.hr} />

      {/* Shipment ticket */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="cube-outline" size={28} color={colors.primary} />
            <View style={{ marginLeft: spacing(1) }}>
              <Text style={styles.muted}>Shipment Number</Text>
              <Text style={styles.strong}>{shipment.id?.slice(0, 5)}</Text>
            </View>
          </View>

          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeTxt, { color: badge.text }]}>{shipment.status}</Text>
          </View>
        </View>
      </View>

      {/* Receiver Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitleUnderline}>Receiver Information</Text>

        <View style={styles.infoRow}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="account-circle-outline" size={22} color={colors.primary} />
            <View style={{ marginLeft: spacing(1) }}>
              <Text style={styles.muted}>Receiver Name</Text>
              <Text style={styles.strong}>{shipment.receiver}</Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.muted}>Contact No.</Text>
            <Text style={styles.strong}>{shipment.phone ?? '—'}</Text>
          </View>
        </View>
      </View>

      {/* Parcel Items */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Parcel Items</Text>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="cube-outline" size={18} color={colors.primary} />
            <Text style={styles.linkSmall}>
              {' '}
              {items.length} item{items.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {items.map((it, idx) => (
          <View key={idx} style={{ marginTop: spacing(1) }}>
            {/* Item label */}
            <Text style={{ fontWeight: '800', color: colors.gray800, marginBottom: 4 }}>
              Item {idx + 1}
            </Text>

            <View style={styles.subRow}>
              <MaterialCommunityIcons name="cube-outline" size={18} color={colors.primary} />
              <View style={{ marginLeft: spacing(1) }}>
                <Text style={styles.muted}>Category</Text>
                <Text style={styles.strong}>{it.category}</Text>
              </View>
            </View>

            {!!it.size && (
              <>
                <View style={styles.line} />
                <View style={styles.subRow}>
                  <MaterialCommunityIcons name="resize" size={18} color={colors.primary} />
                  <View style={{ marginLeft: spacing(1) }}>
                    <Text style={styles.muted}>Size</Text>
                    <Text style={styles.strong}>{it.size}</Text>
                  </View>
                </View>
              </>
            )}

            {!!it.desc && (
              <>
                <View style={styles.line} />
                <View style={styles.subRow}>
                  <MaterialCommunityIcons name="text-box-outline" size={18} color={colors.primary} />
                  <View style={{ marginLeft: spacing(1) }}>
                    <Text style={styles.muted}>Description</Text>
                    <Text style={styles.strong}>{it.desc}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.line} />
            <View style={styles.subRow}>
              <MaterialCommunityIcons name={it.fragile ? 'alert-decagram-outline' : 'shield-check-outline'} size={18} color={colors.primary} />
              <View style={{ marginLeft: spacing(1) }}>
                <Text style={styles.muted}>Fragile</Text>
                <Text style={styles.strong}>{it.fragile ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>


      {/* Parcel details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parcel details</Text>

        <View style={styles.subRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.primary} />
          <View style={{ marginLeft: spacing(1) }}>
            <Text style={styles.muted}>Pickup Location</Text>
            <Text style={styles.strong}>{shipment.from}</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.subRow}>
          <MaterialCommunityIcons name="map-marker-path" size={18} color={colors.primary} />
          <View style={{ marginLeft: spacing(1) }}>
            <Text style={styles.muted}>Parcel Destination</Text>
            <Text style={styles.strong}>{shipment.to}</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.subRow}>
          <MaterialCommunityIcons name="calendar-blank-outline" size={18} color={colors.primary} />
          <View style={{ marginLeft: spacing(1) }}>
            <Text style={styles.muted}>Shipment Date</Text>
            <Text style={styles.strong}>{shipment.date ?? '21-Mar-2025'}</Text>
          </View>
        </View>
      </View>

      {/* Payment details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Details</Text>

        <View style={styles.subRow}>
          <MaterialCommunityIcons name="credit-card-outline" size={18} color={colors.primary} />
          <View style={{ marginLeft: spacing(1) }}>
            <Text style={styles.muted}>Payment Method</Text>
            <Text style={styles.strong}>{shipment.paymentMethod ?? 'Cash on Delivery'}</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.subRow}>
          <MaterialCommunityIcons name="cash-multiple" size={18} color={colors.primary} />
          <View style={{ marginLeft: spacing(1) }}>
            <Text style={styles.muted}>Delivery Fee</Text>
            <Text style={styles.strong}>Nu. {Number(shipment.fee).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Bottom actions */}
      {/* <TouchableOpacity
        style={styles.editBtn}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ShipmentEdit', { id: shipment.id })}
      >
        <MaterialCommunityIcons name="pencil-box-outline" size={20} color={colors.primary} />
        <Text style={styles.editTxt}>  Edit Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        activeOpacity={0.85}
        onPress={() => alert('Cancel Shipment flow…')}
      >
        <Text style={styles.cancelTxt}>Cancel Shipment</Text>
      </TouchableOpacity> */}
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  page: { padding: spacing(2), paddingBottom: spacing(4) },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(1.5),
    justifyContent: 'space-between',
  },
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#EAF4FF', alignItems: 'center', justifyContent: 'center'
  },
  brand: { fontWeight: '800', fontSize: 18, color: colors.gray800 },

  pageTitle: { fontWeight: '800', fontSize: 22, color: colors.gray900, marginTop: spacing(1) },
  hr: { height: 1, backgroundColor: colors.border, marginVertical: spacing(1.25) },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing(1.5),
    marginBottom: spacing(1.25),
    borderWidth: 1,
    borderColor: '#D6E8FF',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },

  muted: { color: colors.gray600 },
  strong: { fontWeight: '800', color: colors.gray900 },

  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  badgeTxt: { fontWeight: '700' },

  cardTitle: { fontWeight: '800', color: colors.gray900, marginBottom: spacing(1) },
  cardTitleUnderline: {
    fontWeight: '800', color: colors.gray900, marginBottom: spacing(1.25),
    textDecorationLine: 'underline', textDecorationColor: colors.gray800
  },

  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  subRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  line: { height: 1, backgroundColor: colors.border, marginVertical: 6 },

  editBtn: {
    borderWidth: 2, borderColor: colors.primary, borderRadius: 12,
    paddingVertical: spacing(1.25), alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', marginTop: spacing(0.5)
  },
  editTxt: { fontWeight: '800', color: colors.primary },

  cancelBtn: {
    backgroundColor: '#EA6B6B', borderRadius: 12, paddingVertical: spacing(1.25),
    alignItems: 'center', justifyContent: 'center', marginTop: spacing(1.25)
  },
  cancelTxt: { color: colors.white, fontWeight: '800' },
});
