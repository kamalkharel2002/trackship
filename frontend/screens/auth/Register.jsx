import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import Field from '../../components/Field';
import PrimaryButton from '../../components/PrimaryButton';
import { spacing } from '../../utils/theme';

export default function Register({ route, navigation }) {
  const { role = 'customer' } = route.params || {};
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirm: '' });

  const submit = () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Incomplete', 'Please fill all required fields.');
      return;
    }
    if (form.password !== form.confirm) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    Alert.alert('Success', 'Registration mock complete. Continue to login.');
    navigation.replace('Login', { role });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: 48, paddingBottom: spacing.lg }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 4 }}>Create account</Text>
        <Text style={{ color: '#6B7280', marginBottom: spacing.md }}>Role: {role === 'customer' ? 'Customer' : 'Transporter'}</Text>

        <Field label="Username" placeholder="Your username" value={form.username} onChangeText={t => setForm({ ...form, username: t })} />
        <Field label="Email" placeholder="you@example.com" keyboardType="email-address" value={form.email} onChangeText={t => setForm({ ...form, email: t })} />
        <Field label="Phone Number" placeholder="Your phone number" keyboardType="phone-pad" value={form.phone} onChangeText={t => setForm({ ...form, phone: t })} />
        <Field label="Password" placeholder="Enter a password" secureTextEntry value={form.password} onChangeText={t => setForm({ ...form, password: t })} />
        <Field label="Confirm Password" placeholder="Re-enter your password" secureTextEntry value={form.confirm} onChangeText={t => setForm({ ...form, confirm: t })} />
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <PrimaryButton title="Create account" onPress={submit} />
      </View>
    </View>
  );
}
