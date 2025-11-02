import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../utils/theme';

export default function PrimaryButton({ title, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled ? styles.disabled : styles.primary, style]}
      activeOpacity={0.85}
    >
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.brand },
  disabled: { backgroundColor: '#D1D5DB' },
  txt: { color: '#fff', fontWeight: '600' },
});
