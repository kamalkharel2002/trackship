import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme';
import PrimaryButton from '../components/PrimaryButton';

export default function Splash({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.topSection}>
          <Image
            source={require('../../assets/logo-placeholder.png')} // logo
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.tagline}>
          Easily track shipments, manage deliveries, monitor drivers, and keep your
          business running smoothly — anytime, anywhere.
        </Text>

        <Image
          source={require('../../assets/Delivery man riding bicycle.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        <View style={styles.buttonGroup}>
          <PrimaryButton
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            style={styles.signIn}
          />
          <PrimaryButton
            title="Not Registered? Sign Up"
            onPress={() => navigation.navigate('RoleChoice')}
            style={styles.signUp}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Signing in as a Hub Coordinator? <Text style={{ fontWeight: '600' }}>Continue</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(2),
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: spacing(6), 
  },
  topSection: {
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  logo: {
    width: 200,
    height: 60,
  },
  tagline: {
    color: colors.gray700,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: spacing(2),
    marginBottom: spacing(3),
  },
  illustration: {
    width: '95%',
    height: 260,
    marginBottom: spacing(4),
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  signIn: {
    width: '85%',
    backgroundColor: colors.primary,
    marginBottom: spacing(1.5),
  },
  signUp: {
    width: '85%',
    backgroundColor: colors.accent,
  },
  footerText: {
    fontSize: 13,
    color: colors.gray700,
    textAlign: 'center',
  },
});
