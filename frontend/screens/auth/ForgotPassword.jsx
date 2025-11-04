import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing } from '../../theme';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const send = () => {
    if (!email) return alert('Enter your email');
    alert('Reset link sent (demo).');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        padding: spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../../../assets/logo-placeholder.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text
        style={{
          textAlign: 'center',
          fontWeight: '800',
          fontSize: 20,
          marginBottom: spacing(2),
        }}
      >
        Forgot Password?
      </Text>

      <Text
        style={{
          textAlign: 'center',
          color: colors.gray700,
          marginBottom: spacing(2),
        }}
      >
        Enter your email address. We will send a link to retrieve your account.
      </Text>

      <TextField
        label="Email"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <PrimaryButton title="SEND LINK" onPress={send} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 60,
    marginBottom: spacing(2),
  },
});
