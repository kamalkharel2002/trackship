import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({
  title,
  onPress,
  style,
  disabled,
  variant = 'solid',         // 'solid' | 'outline'
  color = colors.primary,     // main color (bg for solid, border for outline)
  textStyle,                  // override label style (e.g., { color: 'black' })
  children,                   // optional custom label
  ...rest
}) {
  const isOutline = variant === 'outline';

  const btnStyle = [
    styles.btn,
    isOutline
      ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: color }
      : { backgroundColor: color },
    disabled && styles.disabled,
    style,
  ];

  // default text color: white on solid, app text color on outline
  const fallbackTextColor = isOutline ? (colors.text || '#1C2530') : colors.white;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={btnStyle}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <Text style={[styles.txt, { color: fallbackTextColor }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing(1.5),
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontWeight: '700',
    fontSize: 16,
    // no hard-coded color here anymore
  },
  disabled: { opacity: 0.5 },
});
