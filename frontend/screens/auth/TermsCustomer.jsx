import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing } from '../../theme';

export default function TermsCustomer({ navigation }) {
  return (
    <View style={{flex:1, backgroundColor: colors.white}}>
      <ScrollView contentContainerStyle={{padding: spacing(2)}}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.h}>1. Terms</Text>
        <Text style={styles.p}>
          • Provide correct pickup and delivery details.{"\n"}
          • Pay for services as shown in the App.{"\n"}
          • Be available for delivery or pickup at the agreed times.
        </Text>
        <Text style={styles.h}>2. Payment</Text>
        <Text style={styles.p}>
          • All payments are made through the App.{"\n"}
          • Prices, fees, and payment methods are shown before you confirm a delivery.{"\n"}
          • The app may charge a small service fee or transaction fee.
        </Text>
        <Text style={styles.h}>3. Safety and Conduct</Text>
        <Text style={styles.p}>
          • No illegal or dangerous items may be transported.{"\n"}
          • Respectful communication is required between drivers and customers.{"\n"}
          • We may suspend or ban users who break these rules.
        </Text>
      </ScrollView>

      <View style={{padding: spacing(2), flexDirection:'row', justifyContent:'space-between'}}>
        <PrimaryButton title="Decline" onPress={() => navigation.goBack()} style={{backgroundColor: colors.gray300, flex:1, marginRight:8}} />
        <PrimaryButton title="Accept"  onPress={() => navigation.navigate('SignupCustomer')} style={{flex:1, marginLeft:8}} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title:{ fontWeight:'800', fontSize:22, marginBottom:8 },
  h:{ fontWeight:'700', marginTop:8, marginBottom:6 },
  p:{ color:colors.gray700, lineHeight:22 }
});
