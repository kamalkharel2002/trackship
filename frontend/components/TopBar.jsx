import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

const HIDE_BELL_ROUTES = new Set([
  'Splash',           // splash screen
  'RoleChoice',
  'TermsCustomer',
  'TermsDriver',
  'SignupCustomer',
  'Verify',
  'Login',
  'ForgotPassword',
]);

// Screens that should NOT show the TopBar at all (completely hidden)
const HIDE_TOPBAR_ROUTES = new Set([
  'Splash',          
  'RoleChoice',
  // 'TermsCustomer',
  // 'TermsDriver',
  // 'SignupCustomer',
  // 'Verify',
  'Login',
  // 'ForgotPassword',
]);


export default function TopBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const routeName = route?.name ?? '';
  const showBell = !HIDE_BELL_ROUTES.has(routeName);
  // If route is in hidden list, return nothing
  if (HIDE_TOPBAR_ROUTES.has(routeName)) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Status bar spacer */}
      <View style={{ height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight }} />

      {/* Content Row */}
      <View style={styles.inner}>
        <Image
          source={require('../../assets/logo-placeholder.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {showBell && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.bell}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
        )}
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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  inner: {
    height: 30,
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
