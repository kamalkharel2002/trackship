import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { spacing, colors, radius } from '../../utils/theme';

export default function Terms({ route, navigation }) {
  const { role } = route.params || { role: 'customer' };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: 48, paddingBottom: spacing.lg }}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.section}>1. Terms</Text>
        <Text style={styles.body}>
          · Provide correct pickup and delivery details.{'\n'}
          · Pay for services as shown in the App.{'\n'}
          · Be available for delivery or pickup at the agreed times.
        </Text>
        <Text style={styles.section}>2. Payment</Text>
        <Text style={styles.body}>
          · All payments are made through the App.{'\n'}
          · Prices, fees, and payment methods are shown before you confirm a delivery.
        </Text>
        <Text style={styles.section}>3. Safety & Conduct</Text>
        <Text style={styles.body}>
          · No illegal or dangerous items may be transported.{'\n'}
          · The App may suspend or ban users who break these rules.
        </Text>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <PrimaryButton title="Decline" onPress={() => navigation.goBack()} style={{ backgroundColor: '#E5E7EB', marginBottom: 10 }} />
        <PrimaryButton title="Accept" onPress={() => navigation.replace('Login', { role })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  section: { color: colors.text, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  body: { color: colors.textMuted, lineHeight: 20 },
});
