import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export default function TopBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Status bar space for iOS */}
      <View style={{ height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight }} />

      {/* Content Row */}
      <View style={styles.inner}>
        <Image
          source={require('../../assets/logo-placeholder.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.bell}
        >
          <Ionicons name="notifications-outline" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderBottomLeftRadius: 10,   // gives a soft bottom curve
    borderBottomRightRadius: 10,
  },
  inner: {
    height: 30,                   // slightly taller than before
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    width: 130,
    height: 32,
  },
  bell: {
    position: 'absolute',
    right: spacing(2),
    padding: spacing(1),
  },
});
