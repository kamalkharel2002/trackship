import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme';

export default function Notifications() {
  const { notifications } = useApp();
  const toneBg = { info:'#E5F0FF', success:'#E7FBEA', warning:'#FFF3E0' };

  return (
    <ScrollView contentContainerStyle={{padding: spacing(2)}}>
      <Text style={{fontWeight:'800', fontSize:22, marginBottom:spacing(1)}}>Notifications</Text>
      {notifications.map(n => (
        <View key={n.id} style={[styles.note, {backgroundColor: toneBg[n.tone] || colors.gray100}]}>
          <Text style={{color:colors.gray700}}>{ago(n.createdAt)}</Text>
          <Text style={{marginTop:6, fontWeight:'600'}}>{n.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  note:{ borderRadius: radius.lg, padding: spacing(1.25), marginBottom: spacing(1) }
});
function ago(ts){ const d=Math.floor((Date.now()-ts)/86400000); return d<=0?'1d ago': `${d}d ago`; }

