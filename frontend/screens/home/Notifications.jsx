import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme';

export default function Notifications({ navigation }) {
  const { notifications } = useApp();
  const toneBg = { info: '#E5F0FF', success: '#E7FBEA', warning: '#FFF3E0' };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <View style={{ padding: spacing(2) }}>
        {notifications.map((n) => (
          <View key={n.id} style={[styles.card, { backgroundColor: toneBg[n.tone] || colors.gray100 }]}>
            <Text style={styles.time}>{ago(n.createdAt)}</Text>
            <Text style={styles.text}>{n.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ago(ts) {
  const d = Math.floor((Date.now() - ts) / 86400000);
  return d <= 0 ? '1d ago' : `${d}d ago`;
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingTop: spacing(1.5),
  },
  headerTitle: { fontWeight: '800', fontSize: 20, marginLeft: spacing(1) },
  card: {
    borderRadius: radius.lg,
    padding: spacing(1.5),
    marginBottom: spacing(1),
  },
  time: { color: colors.gray600, fontSize: 13 },
  text: { marginTop: 6, fontWeight: '600', color: colors.text },
});
