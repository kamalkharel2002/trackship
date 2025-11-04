import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme';

const KEY_USER = '@user';

export default function Profile({ navigation }) {
  const { user: ctxUser, logout } = useApp();
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    (async () => {
      try {
        // Prefer context user if present; fall back to AsyncStorage
        let u = ctxUser;
        if (!u) {
          const raw = await AsyncStorage.getItem(KEY_USER);
          if (raw) u = JSON.parse(raw);
        }
        const name = u?.user_name || u?.name || '';
        const phone = u?.phone || '';
        const email = u?.email || '';
        setProfile({ name, phone, email });
      } catch (e) {
        setProfile({ name: '', phone: '', email: '' });
      }
    })();
  }, [ctxUser]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: spacing(2) }}>
      <Text style={{ fontWeight: '800', fontSize: 22, marginBottom: spacing(1) }}>Settings</Text>

      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <Image
          source={require('../../../assets/profile.png')}
          style={{ width: 90, height: 90, borderRadius: 45, opacity: 0.15 }}
        />
        <Text style={{ fontWeight: '800', marginTop: 8 }}>
          {profile.name || '—'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.left}>Name</Text>
        <Text style={styles.right}>{profile.name || '—'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.left}>Phone</Text>
        <Text style={styles.right}>{profile.phone || '—'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.left}>Email</Text>
        <Text style={styles.right}>{profile.email || '—'}</Text>
      </View>

      <Text style={{ color: colors.gray700, marginTop: spacing(2), marginBottom: 6 }}>
        Account Settings
      </Text>

      <TouchableOpacity style={styles.item}>
        <Text>Profile setting</Text>
        <Text>›</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text>Change password</Text>
        <Text>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, { marginTop: spacing(1) }]}
        onPress={() => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        }}
      >
        <Text style={{ fontWeight: '800' }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing(1.25),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  left: { color: colors.gray700 },
  right: { fontWeight: '700' },
  item: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing(1.25),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
