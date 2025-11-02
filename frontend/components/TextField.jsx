import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function TextField({ label, ...props }) {
  return (
    <View style={{ marginBottom: spacing(1.5) }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.gray500}
        style={styles.input}
        {...props}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  label:{ marginBottom:6, color:colors.text, fontWeight:'600' },
  input:{
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing(1.5),
    height: 48
  },
});
