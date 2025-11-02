import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import Field from '../../components/Field';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../store/auth';
import { spacing } from '../../utils/theme';

export default function Login({ route, navigation }) {
  const { role = 'customer' } = route.params || {};
  const { login } = useAuth();
  const [username, setUsername] = useState(role === 'customer' ? 'customer' : 'transporter');
  const [password, setPassword] = useState('password123');

  const onSubmit = async () => {
    try {
      await login({ role, username, password });
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (err) {
      Alert.alert('Login failed', err.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: 64 }}>
        <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: '700', marginBottom: spacing.lg }}>
          Login ({role})
        </Text>
        <Field label="Username" value={username} onChangeText={setUsername} placeholder="Enter your username" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" />
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: spacing.lg }}>
          Demo — Customer: (customer / password123), Transporter: (transporter / password123)
        </Text>
        <PrimaryButton title="LOGIN" onPress={onSubmit} />
        <Text
          onPress={() => navigation.navigate('Register', { role })}
          style={{ textAlign: 'center', color: '#6B7280', marginTop: spacing.sm }}
        >
          Don’t have an account? Sign up
        </Text>
      </ScrollView>
    </View>
  );
}
