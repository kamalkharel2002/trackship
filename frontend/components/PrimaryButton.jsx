import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled && styles.disabled, style]}
    >
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn:{ backgroundColor: colors.primary, paddingVertical: spacing(1.5), borderRadius: radius.pill, alignItems:'center', justifyContent:'center' },
  txt:{ color: colors.white, fontWeight:'700', fontSize:16 },
  disabled:{ opacity:0.5 }
});
