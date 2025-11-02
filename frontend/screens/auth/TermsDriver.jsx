import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing } from '../../theme';

export default function TermsDriver({ navigation }) {
  return (
    <View style={{flex:1, backgroundColor: colors.white}}>
      <ScrollView contentContainerStyle={{padding: spacing(2)}}>
        <Text style={styles.title}>Terms of Service (Transporter)</Text>
        <Text style={styles.h}>1. Transporter Responsibilities</Text>
        <Text style={styles.p}>
          • Hold a valid driver’s license and required permits.{"\n"}
          • Keep a roadworthy, insured vehicle.{"\n"}
          • Accept and complete requests safely and on time.{"\n"}
          • Keep customer information private.{"\n"}
          • Use the App only for lawful transport activities.
        </Text>
        <Text style={styles.h}>2. Safety and Conduct</Text>
        <Text style={styles.p}>
          • You must not transport illegal, hazardous, or restricted items.{"\n"}
          • Always drive responsibly and follow local regulations.
        </Text>
        <Text style={[styles.p, {marginTop:12, fontStyle:'italic'}]}>Transporter sign-up will be enabled later.</Text>
      </ScrollView>
      <View style={{padding: spacing(2)}}>
        <PrimaryButton title="Back" onPress={() => navigation.goBack()} style={{backgroundColor: colors.gray300}} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title:{ fontWeight:'800', fontSize:22, marginBottom:8 },
  h:{ fontWeight:'700', marginTop:8, marginBottom:6 },
  p:{ color:colors.gray700, lineHeight:22 }
});
