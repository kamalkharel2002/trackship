import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

export default function Field({
  label, placeholder, value, onChangeText, keyboardType = 'default', secureTextEntry = false, style,
}) {
  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, color: colors.text, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#fff'
  }
});
