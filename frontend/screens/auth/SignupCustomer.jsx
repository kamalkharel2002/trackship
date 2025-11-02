import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { spacing } from '../../theme';

export default function SignupCustomer({ navigation }) {
  const [form, setForm] = useState({ username:'', phone:'', email:'', password:'', confirm:'' });

  const onSubmit = () => {
    if (!form.username || !form.email || !form.password || form.password !== form.confirm) {
      alert('Please complete the form. Passwords must match.'); return;
    }
    // TODO: POST /api/auth/register
    navigation.navigate('Verify', { email: form.email });
  };

  return (
    <ScrollView contentContainerStyle={{padding: spacing(2)}}>
      <Text style={{fontWeight:'800', fontSize:22, marginBottom:12}}>Create account</Text>
      <TextField label="Username *" placeholder="Your username" value={form.username} onChangeText={(v)=>setForm({...form, username:v})} />
      <TextField label="Phone Number *" placeholder="Your phone number" keyboardType='phone-pad' value={form.phone} onChangeText={(v)=>setForm({...form, phone:v})} />
      <TextField label="Email *" placeholder="Your email" keyboardType='email-address' value={form.email} onChangeText={(v)=>setForm({...form, email:v})} />
      <TextField label="Password *" placeholder="Must be 8 characters" secureTextEntry value={form.password} onChangeText={(v)=>setForm({...form, password:v})} />
      <TextField label="Confirm Password *" placeholder="Repeat password" secureTextEntry value={form.confirm} onChangeText={(v)=>setForm({...form, confirm:v})} />
      <PrimaryButton title="Create account" onPress={onSubmit} />
    </ScrollView>
  );
}
