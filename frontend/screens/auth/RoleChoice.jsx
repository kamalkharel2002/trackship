import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export default function RoleChoice({ navigation }) {
  return (
    <View style={styles.wrap}>
      <Image source={require('../../../assets/logo-placeholder.png')} style={{width:120, height:120}} />
      <Text style={styles.heading}>Empowering Smarter{'\n'}Logistic Solutions</Text>

      <TouchableOpacity style={styles.rowBtn} onPress={() => navigation.navigate('TermsCustomer')}>
        <Text style={styles.rowIcon}>👤</Text>
        <Text style={styles.rowLabel}>Register as Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rowBtn} onPress={() => navigation.navigate('TermsDriver')}>
        <Text style={styles.rowIcon}>🚚</Text>
        <Text style={styles.rowLabel}>Register as Transporter</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:colors.white, padding:spacing(2), alignItems:'center' },
  heading:{ textAlign:'center', fontSize:20, fontWeight:'800', marginVertical: spacing(2) },
  rowBtn:{ width:'100%', backgroundColor:colors.white, borderWidth:1, borderColor:colors.border, borderRadius: radius.pill, paddingVertical:14, paddingHorizontal:16, flexDirection:'row', alignItems:'center', marginTop:12 },
  rowIcon:{ fontSize:18, marginRight:10 },
  rowLabel:{ fontWeight:'700', color:colors.text }
});
