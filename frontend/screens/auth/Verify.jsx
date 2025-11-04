import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import ModalDialog from '../../components/ModalDialog';
import { colors, radius, spacing } from '../../theme';
import Config from '../../config';

const RESEND_COOLDOWN = 60; // seconds

export default function Verify({ route, navigation }) {
  const { email, username, phone, password } = route.params || {};
  const [code, setCode] = useState(['', '', '', '']);
  const [ok, setOk] = useState(false);

  // resend state
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN); // start locked so user waits a moment
  const [resending, setResending] = useState(false);
  const intervalRef = useRef(null);

  // focus refs
  const inputRefs = useRef([]);

  // start/maintain the countdown
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const onVerify = async () => {
    if (!email || !username || !phone || !password) {
      alert('Missing signup data. Please go back and fill the form again.');
      return;
    }
    const otp = code.join('');
    if (otp.length !== 4) {
      alert('Enter the 4-digit code.');
      return;
    }

    try {
      const response = await fetch(`${Config.BASE_URL}auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, user_name: username, phone, password }),
      });

      let data;
      try { data = await response.json(); } catch { data = {}; }

      if (!response.ok) {
        const msg = data?.message || 'Verification failed.';
        const errs = Array.isArray(data?.errors) ? `\n• ${data.errors.join('\n• ')}` : '';
        console.error('Verification failed payload:', data);
        alert(`${msg}${errs}`);
        return;
      }

      console.log('Verification success:', data);
      setOk(true);
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleChange = (text, index) => {
    const val = text.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    if (val && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!val && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onResend = async () => {
    if (!email) {
      alert('Missing email to resend the code.');
      return;
    }
    try {
      setResending(true);
      const response = await fetch(`${Config.BASE_URL}auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data;
      try { data = await response.json(); } catch { data = {}; }

      if (!response.ok) {
        const msg = data?.message || 'Could not resend code.';
        const errs = Array.isArray(data?.errors) ? `\n• ${data.errors.join('\n• ')}` : '';
        console.error('Resend failed payload:', data);
        alert(`${msg}${errs}`);
        return;
      }

      // reset inputs for clarity (optional)
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();

      // restart cooldown
      setCooldown(RESEND_COOLDOWN);
      alert('A new verification code has been sent.');
    } catch (err) {
      console.error('Resend network error:', err);
      alert('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const mm = Math.floor(cooldown / 60);
  const ss = String(cooldown % 60).padStart(2, '0');
  const canResend = cooldown === 0 && !resending;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: spacing(2), alignItems: 'center' }}>
      <Text style={{ fontWeight: '800', fontSize: 20, marginTop: spacing(2) }}>Verify Account</Text>
      <Text style={{ color: colors.gray700, textAlign: 'center', marginVertical: spacing(1) }}>
        Code has been sent to <Text style={{ fontWeight: '700' }}>{email || 'your email'}</Text>. Enter the code to verify your account
      </Text>

      <View style={{ flexDirection: 'row', marginVertical: spacing(2) }}>
        {code.map((v, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputRefs.current[i] = ref)}
            value={v}
            onChangeText={(t) => handleChange(t, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.box}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        ))}
      </View>

      {/* Resend row */}
      <View style={{ width: '100%', alignItems: 'center', marginBottom: spacing(1) }}>
        <TouchableOpacity
          onPress={onResend}
          disabled={!canResend}
          style={[
            styles.resendBtn,
            !canResend && styles.resendBtnDisabled,
          ]}
        >
          {resending ? (
            <ActivityIndicator />
          ) : (
            <Text style={[styles.resendTxt, !canResend && styles.resendTxtDisabled]}>
              {canResend ? 'Resend code' : `Resend in ${mm}:${ss}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <PrimaryButton title="VERIFY ACCOUNT" onPress={onVerify} style={{ width: '100%' }} />

      <ModalDialog
        visible={ok}
        title="Verified"
        message="Your account has been verified successfully."
        onConfirm={() => {
          setOk(false);
          navigation.replace('Login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 4,
    borderRadius: radius.md,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
  },
  resendBtn: {
    paddingVertical: spacing(0.75),
    paddingHorizontal: spacing(1.25),
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resendBtnDisabled: {
    borderColor: colors.gray400,
    backgroundColor: colors.gray100,
  },
  resendTxt: {
    fontWeight: '700',
    color: colors.primary,
  },
  resendTxtDisabled: {
    color: colors.gray500,
  },
});
