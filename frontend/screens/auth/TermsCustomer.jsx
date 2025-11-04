import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing } from '../../theme';

export default function TermsCustomer({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>AGREEMENT</Text>
        <Text style={styles.title}>Terms of Service</Text>

        <Text style={styles.sectionH}>1. Terms</Text>
        <Text style={styles.p}>
          {'\u2022'} Provide correct pickup and delivery details.{'\n'}
          {'\u2022'} Pay for services as shown in the App.{'\n'}
          {'\u2022'} Be available for delivery or pickup at the agreed times.
        </Text>

        <Text style={styles.sectionH}>2. Payment</Text>
        <Text style={styles.p}>
          {'\u2022'} All payments are made through the App.{'\n'}
          {'\u2022'} Prices, fees, and payment methods are shown before you confirm a delivery.{'\n'}
          {'\u2022'} The app may charge a small service or transaction fee.
        </Text>

        <Text style={styles.sectionH}>3. Safety and Conduct</Text>
        <Text style={styles.p}>
          {'\u2022'} No illegal or dangerous items may be transported.{'\n'}
          {'\u2022'} Respectful communication is required between drivers and customers.{'\n'}
          {'\u2022'} TrackShip application can suspend or ban users who break these rules.
        </Text>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.declineBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.declineTxt}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignupCustomer')}
          style={styles.acceptBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptTxt}>Accept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  kicker: {
    color: colors.gray400 ?? '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: spacing(1),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary ?? '#2F80ED', // blue like the mock
    marginBottom: spacing(3),
  },
  sectionH: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing(2),
    marginBottom: spacing(1),
    color: colors.text ?? '#111',
  },
  p: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.gray800 ?? '#444',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
  },

  // Decline: outlined red, rounded corners (matches image)
  declineBtn: {
    flex: 1,
    marginRight: spacing(1),
    borderWidth: 1,
    borderColor: '#EB5757',     // red outline
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: spacing(1.75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EB5757',
  },

  // Accept: solid green, white label (matches image)
  acceptBtn: {
    flex: 1,
    marginLeft: spacing(1),
    backgroundColor: '#27AE60', // green fill
    borderRadius: 16,
    paddingVertical: spacing(1.75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
});
