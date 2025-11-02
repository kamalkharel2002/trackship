import React from 'react';
import { View, Text } from 'react-native';
import TopBar from '../../components/TopBar';
import { useAuth } from '../../store/auth';
import PrimaryButton from '../../components/PrimaryButton';

export default function Profile() {
  const { session, logout } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopBar title="Profile" />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>User</Text>
        <Text style={{ color: '#111827', marginBottom: 20 }}>{session ? `${session.username} (${session.role})` : 'Guest'}</Text>
        <PrimaryButton title="Logout" onPress={logout} />
      </View>
    </View>
  );
}
