// components/TextField.jsx
import React, { useState, memo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

/**
 * TextField with built-in smooth focus highlight.
 * No outer wrapper frame is added — the highlight is on the real input.
 */
function TextFieldBase({
  label,
  style,
  onFocus,
  onBlur,
  placeholderTextColor = colors.gray500,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: spacing(1.5) }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...props}
        placeholderTextColor={placeholderTextColor}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        // single visual frame: the input itself
        style={[
          styles.input,
          focused && styles.inputFocused,
          style, // allow overrides from parent
        ]}
      />
    </View>
  );
}

export default memo(TextFieldBase);

const styles = StyleSheet.create({
  label: { marginBottom: 6, color: colors.text, fontWeight: '600' },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing(1.5),
    height: 48,
  },
  inputFocused: {
    borderColor: '#8FB6FF',
    backgroundColor: '#F7FAFF',
    // soft glow (Android elevation + iOS shadow)
    elevation: 1,
    shadowColor: '#0050FF',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
