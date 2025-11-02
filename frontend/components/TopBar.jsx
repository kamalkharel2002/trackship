import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { spacing, colors } from '../utils/theme';

export default function TopBar({ title, onBellPress }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onBellPress}>
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 48, paddingBottom: spacing.sm, paddingHorizontal: spacing.lg,
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  title: { fontSize: 20, fontWeight: '700' }
});
