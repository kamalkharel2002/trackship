import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import ModalDialog from '../../components/ModalDialog';
import { colors, radius, spacing } from '../../theme';
import Config from '../../config'


export default function Verify({ route, navigation }) {
  const { email, username, phone, password } = route.params || {};
  const [code, setCode] = useState(['','','','']); // 4 boxes
  const [ok, setOk] = useState(false);

  const onVerify = async () => {
    // guard: ensure we actually have the fields
    if (!email || !username || !phone || !password) {
      alert('Missing signup data. Please go back and fill the form again.');
      return;
    }

    const otp = code.join('');
    if (otp.length !== 4) { // API sample shows 4 digits
      alert('Enter the 4-digit code.');
      return;
    }

    try {
      const response = await fetch(`${Config.BASE_URL}auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          user_name: username,   // API expects user_name (snake_case)
          phone,
          password,
        }),
      });

      let data;
      try { data = await response.json(); } catch { data = {}; }

      if (!response.ok) {
        // Show server validation details if present
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

  return (
    <View style={{flex:1, backgroundColor:colors.white, padding:spacing(2), alignItems:'center'}}>
      <Text style={{fontWeight:'800', fontSize:20, marginTop:spacing(2)}}>Verify Account</Text>
      <Text style={{color:colors.gray700, textAlign:'center', marginVertical:spacing(1)}}>
        Code has been sent to <Text style={{fontWeight:'700'}}>{email || 'your email'}</Text>. Enter the code to verify your account
      </Text>

      <View style={{flexDirection:'row', marginVertical: spacing(2)}}>
        {code.map((v,i)=>(
          <TextInput
            key={i}
            value={v}
            onChangeText={(t)=>{
              const c=[...code];
              c[i]=t.replace(/\D/g,'').slice(-1);
              setCode(c);
            }}
            keyboardType='number-pad'
            maxLength={1}
            style={styles.box}
          />
        ))}
      </View>

      <PrimaryButton title="VERIFY ACCOUNT" onPress={onVerify} style={{width:'100%'}} />

      <ModalDialog
        visible={ok}
        title="Verified"
        message="Your account has been verified successfully."
        onConfirm={()=>{ setOk(false); navigation.replace('Login'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box:{ width:48, height:56, borderWidth:1, borderColor:colors.primary, marginHorizontal:4, borderRadius:radius.md, textAlign:'center', fontSize:22, fontWeight:'800' }
});
