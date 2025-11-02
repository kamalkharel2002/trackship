import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme';

export default function Splash({ navigation }) {
  return (
    <View style={styles.wrap}>
      <Image source={require('../../assets/logo-placeholder.png')} style={{width:120, height:120, marginBottom:spacing(2)}} />
      <Text style={styles.title}>TrackShip</Text>
      <Text style={styles.sub}>Easily track shipments, manage deliveries, monitor drivers, and keep your business running smoothly — anytime, anywhere.</Text>

      <PrimaryButton title="Sign In" onPress={() => navigation.navigate('Login')} style={{width:'85%', marginTop:spacing(2)}} />

      <PrimaryButton title="Not Registered? Sign Up" onPress={() => navigation.navigate('RoleChoice')} style={{width:'85%', marginTop:spacing(1), backgroundColor:colors.accent}} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ flex:1, backgroundColor: colors.white, alignItems:'center', justifyContent:'center', padding:spacing(2) },
  title:{ fontWeight:'800', fontSize:26, color:colors.primary, marginBottom:8 },
  sub:{ textAlign:'center', color:colors.gray700 }
});
