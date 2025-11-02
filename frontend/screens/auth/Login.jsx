import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { useApp } from '../../context/AppContext';
import { colors, spacing } from '../../theme';

export default function Login({ navigation }) {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    if (login(username.trim(), password)) navigation.replace('Home');
  };

  return (
    <View style={styles.wrap}>
      <Image source={require('../../../assets/logo-placeholder.png')} style={{width:110, height:110, marginBottom:spacing(1)}} />
      <Text style={styles.title}>Login</Text>

      <View style={{width:'100%'}}>
        <TextField label="Email" placeholder="Enter your Email" value={username} onChangeText={setUsername} />
        <TextField label="Password" placeholder="Enter your Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')}><Text style={styles.link}>Forgot password?</Text></TouchableOpacity>
      </View>

      <PrimaryButton title="LOGIN" onPress={onLogin} style={{width:'100%', marginTop:spacing(1)}} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:colors.white, padding:spacing(2), alignItems:'center', justifyContent:'center' },
  title:{ fontSize:20, fontWeight:'800', marginBottom:12 },
  link:{ textAlign:'right', color:colors.gray700, marginTop:6 }
});
