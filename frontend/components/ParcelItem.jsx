import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius, spacing } from '../utils/theme';

export default function ParcelItem({ index, item, onChange, onRemove }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowHeader}>
        <Text style={styles.h}>Item {index + 1}</Text>
        {index > 0 && (
          <TouchableOpacity onPress={onRemove} style={{ paddingHorizontal: 6, paddingVertical: 4 }}>
            <Ionicons name="close" size={18} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>Parcel Category</Text>
      <TextInput
        placeholder="e.g., Electronic"
        value={item.category}
        onChangeText={(t) => onChange({ ...item, category: t })}
        style={styles.input}
      />
      <Text style={[styles.label, { marginTop: spacing.sm }]}>Parcel Description</Text>
      <TextInput
        placeholder="Enter parcel description"
        value={item.description}
        onChangeText={(t) => onChange({ ...item, description: t })}
        style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    backgroundColor: '#fff', padding: spacing.md, marginBottom: spacing.sm
  },
  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  h: { fontWeight: '700', color: colors.text },
  label: { color: colors.textMuted, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff'
  },
});
