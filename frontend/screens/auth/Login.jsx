import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../config'
import { fetchAndStoreHubs } from '../../utils/hubs';

const KEY_ACCESS = '@access_token';
const KEY_REFRESH = '@refresh_token';
const KEY_USER = '@user';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const onLogin = async () => {
  if (!email || !password) {
    Alert.alert('Missing Info', 'Please enter both email and password.');
    return;
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 15000); // optional timeout

  try {
    const res = await fetch(`${Config.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    clearTimeout(id);

    // try to parse JSON, but don't crash if body is empty/non-json
    let json = null;
    try { json = await res.json(); } catch { /* leave json = null */ }

    if (!res.ok || !json || json.success !== true) {
      const msg = json?.message || 'Invalid email or password';
      console.log('Login failed:', msg);   // log, not error -> avoids red screen
      Alert.alert('Invalid Login', msg);
      return;
    }

    const { data } = json;
    await AsyncStorage.multiSet([
      ['@access_token', data.access_token],
      ['@refresh_token', data.refresh_token],
      ['@user', JSON.stringify(data.user)],
    ]);

    await fetchAndStoreHubs();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  } catch (err) {
    console.log('Network error:', err?.message || String(err));
    Alert.alert('Network Error', 'Please check your connection and try again.');
  }
};


  return (
    <View style={styles.wrap}>
      <Image
        source={require('../../../assets/logo-placeholder.png')}
        style={{ width: 110, height: 110, marginBottom: spacing(1) }}
      />
      <Text style={styles.title}>Login</Text>

      <View style={{ width: '100%' }}>
        <TextField
          label="Email"
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          label="Password"
          placeholder="Enter your Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton
        title={loading ? 'Logging in...' : 'LOGIN'}
        onPress={onLogin}
        disabled={loading}
        style={{ width: '100%', marginTop: spacing(1) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.white, padding: spacing(2), alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  link: { textAlign: 'right', color: colors.gray700, marginTop: 6 },
});
