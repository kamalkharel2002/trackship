import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import ModalDialog from '../../components/ModalDialog';
import { colors, radius, spacing } from '../../theme';

export default function Verify({ route, navigation }) {
  const { email } = route.params || {};
  const [code, setCode] = useState(['','','','']);
  const [ok, setOk] = useState(false);

  const onVerify = () => {
    if (code.join('').length !== 4) { alert('Enter the 4-digit code.'); return; }
    setOk(true);
  };

  return (
    <View style={{flex:1, backgroundColor:colors.white, padding:spacing(2), alignItems:'center'}}>
      <Text style={{fontWeight:'800', fontSize:20, marginTop:spacing(2)}}>Verify Account</Text>
      <Text style={{color:colors.gray700, textAlign:'center', marginVertical:spacing(1)}}>Code has been sent to <Text style={{fontWeight:'700'}}>{email || 'your email'}</Text>. Enter the code to verify your account</Text>

      <View style={{flexDirection:'row', marginVertical: spacing(2)}}>
        {code.map((v,i)=>(
          <TextInput key={i} value={v} onChangeText={(t)=>{
            const c=[...code]; c[i]=t.replace(/\D/g,'').slice(-1); setCode(c);
          }} keyboardType='number-pad' maxLength={1} style={styles.box} />
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
  box:{ width:56, height:56, borderWidth:1, borderColor:colors.primary, marginHorizontal:6, borderRadius:radius.md, textAlign:'center', fontSize:22, fontWeight:'800' }
});
