import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.txt, active && styles.activeTxt]}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  chip:{ paddingVertical:8, paddingHorizontal:14, borderRadius: radius.pill, backgroundColor: colors.gray100, marginRight:10, borderWidth:1, borderColor:colors.border },
  active:{ backgroundColor: colors.primary },
  txt:{ color:colors.text, fontWeight:'600' },
  activeTxt:{ color:colors.white }
});
