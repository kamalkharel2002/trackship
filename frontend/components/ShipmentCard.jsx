import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function ShipmentCard({ data, onDetails }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowSpace}>
        <Text style={styles.small}>Shipment Number</Text>
        <View style={[styles.badge, statusBg(data.status)]}><Text style={styles.badgeTxt}>{data.status}</Text></View>
      </View>
      <Text style={styles.id}>{data.id}</Text>

      <View style={styles.sep} />

      <View style={styles.rowSpace}>
        <Text>{data.from}</Text>
        <Text style={{fontSize:18}}>➜</Text>
        <Text numberOfLines={1} style={{maxWidth:'45%'}}>{data.to}</Text>
      </View>

      <View style={styles.rowSpace}>
        <Text style={styles.small}>Receiver’s Name{'\n'}<Text style={styles.bold}>{data.receiver}</Text></Text>
        <Text style={styles.small}>Receiver’s Contact No.{'\n'}<Text style={styles.bold}>{data.phone}</Text></Text>
      </View>

      <View style={styles.sep} />

      <View style={styles.rowSpace}>
        <Text style={styles.bold}>Delivery Fee</Text>
        <Text className="font-bold">Nu. {Number(data.fee).toFixed(2)}</Text>
      </View>

      <TouchableOpacity onPress={onDetails} style={styles.cta}>
        <Text style={styles.ctaTxt}>VIEW DETAILS</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  card:{ backgroundColor: colors.white, borderColor:colors.border, borderWidth:1, borderRadius: radius.lg, padding: spacing(1.5), marginBottom: spacing(1.25), shadowColor:'#000', shadowOpacity:.05, shadowRadius:6, elevation:2 },
  rowSpace:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 },
  small:{ color:colors.gray700 },
  id:{ fontSize:16, fontWeight:'700', marginBottom:6 },
  bold:{ fontWeight:'700' },
  sep:{ height:1, backgroundColor: colors.border, marginVertical:8 },
  badge:{ paddingVertical:4, paddingHorizontal:10, borderRadius: radius.pill },
  badgeTxt:{ color: colors.white, fontWeight:'700' },
  cta:{ backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical:10, alignItems:'center', marginTop:10 },
  ctaTxt:{ color: colors.white, fontWeight:'700' },
});
function statusBg(s){ 
  const m = { 'Pending':'#E6A33A', 'In-Transit':'#34C759', 'To Receive':'#5A67D8', 'Received':'#16A34A', 'Canceled':'#EF4444' };
  return { backgroundColor: m[s] || colors.primary };
}
