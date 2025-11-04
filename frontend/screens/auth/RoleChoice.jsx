import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, spacing, radius } from '../../theme';

export default function RoleChoice({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        {/* Logo */}
        <Image
          source={require('../../../assets/logo-placeholder.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Tagline / Heading */}
        <Text style={styles.heading}>
          Empowering Smarter{'\n'}Logistic Solutions
        </Text>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.rowBtn}
            onPress={() => navigation.navigate('TermsCustomer')}
          >
            <Text style={styles.rowIcon}>👤</Text>
            <Text style={styles.rowLabel}>Register as Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rowBtn}
            onPress={() => navigation.navigate('TermsDriver')}
          >
            <Text style={styles.rowIcon}>🚚</Text>
            <Text style={styles.rowLabel}>Register as Transporter</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: spacing(4), // slight downward adjustment
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: spacing(3),
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray700,
    lineHeight: 24,
    marginBottom: spacing(4),
  },
  buttonGroup: {
    width: '85%',
    alignItems: 'center',
  },
  rowBtn: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing(1.5),
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  rowIcon: {
    fontSize: 18,
    marginRight: spacing(1),
  },
  rowLabel: {
    fontWeight: '700',
    color: colors.text,
  },
});
