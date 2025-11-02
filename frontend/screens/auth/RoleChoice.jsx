import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius } from '../../utils/theme';

export default function RoleChoice({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.centerBox}>
        <Image source={require('../../../assets/logo.png')} style={{ width: 140, height: 140 }} />
        <Text style={styles.hero}>Empowering Smarter{'\n'}Logistic Solutions</Text>
      </View>

      <View style={{ marginTop: 36, paddingHorizontal: spacing.lg }}>
        <PrimaryButton title="Sign In as Customer" onPress={() => navigation.navigate('Terms', { role: 'customer' })} />
        <PrimaryButton title="Sign In as Transporter" style={{ marginTop: 12 }} onPress={() => navigation.navigate('Terms', { role: 'transporter' })} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Register', { role: 'customer' })}
          style={styles.altBtn}
        >
          <Text style={styles.altTxt}>Not Registered? Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.caption}>Signing in as a Hub Coordinator? Continue</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerBox: { alignItems: 'center', justifyContent: 'center', marginTop: 96 },
  hero: { marginTop: 16, fontSize: 22, fontWeight: '700', textAlign: 'center', color: colors.text, paddingHorizontal: 24 },
  altBtn: { marginTop: 14, backgroundColor: '#FACC15', borderRadius: radius.lg, paddingVertical: 12, alignItems: 'center' },
  altTxt: { color: '#111827', fontWeight: '600' },
  caption: { textAlign: 'center', fontSize: 12, color: '#6B7280', marginTop: 8 },
});
