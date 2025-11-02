import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';
import { shadowLg } from '../../utils/ui';
import { colors, spacing, radius } from '../../utils/theme';

export default function Home() {
  const card = {
    shipmentNo: 'AB1234XY78',
    status: 'Pending',
    from: 'Shaba, Paro',
    to: 'Taba, Thimphu',
    name: 'Karma Dorji',
    phone: '178329738',
    fee: 'Nu. 150.00'
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title="TrackShip" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        <View style={[styles.hero, shadowLg]}>
          <Text style={styles.heroTitle}>Hi, Pema</Text>
          <Text style={styles.heroBody}>Quickly send, track, or check your delivery status.</Text>
        </View>

        <View style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
          <Text style={{ fontSize: 22, fontWeight: '700' }}>Dashboard</Text>
          <View style={styles.chipsRow}>
            {['ALL','PENDING','IN-TRANSIT','TO RECEIVE','RECEIVED'].map((t, idx) => (
              <View key={t} style={[styles.chip, idx===1 ? styles.chipActive : styles.chipIdle]}>
                <Text style={[styles.chipTxt, idx===1 ? { color: '#fff' } : {}]}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, shadowLg]}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.iconCircle}><Text style={{ color: colors.brand, fontWeight: '700' }}>📦</Text></View>
              <View>
                <Text style={styles.muted}>Shipment Number</Text>
                <Text style={styles.bold}>{card.shipmentNo}</Text>
              </View>
            </View>
            <View style={styles.badge}><Text style={styles.badgeTxt}>{card.status}</Text></View>
          </View>

          <View style={styles.timeline}>
            <View style={styles.rowBetween}>
              <Text style={styles.text}>{card.from}</Text>
              <Text style={styles.text}>{card.to}</Text>
            </View>
            <View style={[styles.rowBetween, { marginTop: spacing.sm }]}>
              <View>
                <Text style={styles.muted}>Receiver’s Name</Text>
                <Text style={styles.bold}>{card.name}</Text>
              </View>
              <View>
                <Text style={styles.muted}>Receiver’s Contact</Text>
                <Text style={styles.bold}>{card.phone}</Text>
              </View>
            </View>
            <View style={[styles.rowBetween, { marginTop: spacing.md }]}>
              <Text style={styles.bold}>Delivery Fee</Text>
              <Text style={styles.bold}>{card.fee}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: '#fff', borderRadius: radius.xl, marginTop: spacing.sm, padding: spacing.lg },
  heroTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
  heroBody: { color: colors.textMuted },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipIdle: { backgroundColor: '#fff', borderColor: colors.border },
  chipTxt: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  card: { backgroundColor: '#fff', borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.xl },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  badge: { backgroundColor: colors.amberBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeTxt: { color: colors.amberText, fontWeight: '700' },
  timeline: { borderLeftWidth: 2, borderLeftColor: colors.brand, paddingLeft: spacing.md, paddingVertical: spacing.sm },
  text: { color: colors.text },
  muted: { color: colors.textMuted, fontSize: 12 },
  bold: { fontWeight: '700', color: colors.text },
});
