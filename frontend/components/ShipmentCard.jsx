import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

// components/ShipmentCard.jsx
export default function ShipmentCard({ data = {}, onDetails }) {
  const id = data.id || data.shipment_number || '—';
  const status = data.status || 'Pending';
  const { bg, fg } = statusStyle(status);

  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.rowSpace}>
        <View style={styles.rowLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name="cube-outline" size={18} color="#007AFF" />
          </View>
          <View>
            <Text style={styles.small}>Shipment Number</Text>
            <Text style={styles.id}>{id?.slice(0, 5)}</Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeTxt, { color: fg }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.sep} />

      {/* route */}
      <View style={[styles.rowSpace, { marginBottom: 6 }]}>
        <Text style={styles.text}>{data.from || '—'}</Text>
        <Ionicons name="chevron-forward" size={18} color="#444" />
        <Text style={[styles.text, { maxWidth: '45%' }]} numberOfLines={1}>
          {data.to || '—'}
        </Text>
      </View>

      {/* receiver */}
      <View style={styles.rowSpace}>
        <View>
          <Text style={styles.small}>Receiver’s Name</Text>
          <Text style={styles.text}>{data.receiver || '—'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.small}>Receiver’s Contact No.</Text>
          <Text style={styles.text}>{data.phone || '—'}</Text>
        </View>
      </View>

      <View style={styles.sep} />

      {/* fee */}
      <View style={styles.rowSpace}>
        <Text style={styles.small}>Delivery Fee</Text>
        <Text style={styles.text}>
          {Number.isFinite(Number(data.fee)) ? `Nu. ${Number(data.fee).toFixed(2)}` : '—'}
        </Text>
      </View>

      {/* CTA (disabled for placeholders) */}
      <TouchableOpacity onPress={onDetails} style={[styles.cta, !onDetails && { opacity: 0.5 }]} disabled={!onDetails}>
        <Text style={styles.ctaTxt}>VIEW DETAILS</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing(1.5),
    marginBottom: spacing(1.25),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  small: {
    fontSize: 13,
    color: '#6B7280', // gray-500
    fontWeight: '400',
  },
  id: {
    fontSize: 15,
    color: '#1F2937', // gray-800 (light black)
    fontWeight: '400',
  },
  text: {
    fontSize: 14,
    color: '#1F2937', // light black
    fontWeight: '400',
  },
  sep: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  badgeTxt: {
    fontSize: 13,
    fontWeight: '400', // regular
  },
  cta: {
    backgroundColor: '#4DA3FF',
    borderRadius: radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  ctaTxt: {
    color: colors.white,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

/** Return light badge background + readable foreground color */
function statusStyle(s) {
  const map = {
    'Pending':      { bg: '#FDEDD3', fg: '#8A5A11' },
    'In-Transit':   { bg: '#C7F0D8', fg: '#166534' },
    'To Receive':   { bg: '#E4E0F9', fg: '#4C1D95' },
    'Received':     { bg: '#E0F6E8', fg: '#166534' },
    'Canceled':     { bg: '#F8D7DA', fg: '#991B1B' },
  };
  return map[s] || { bg: '#E6E6E6', fg: '#111827' };
}
