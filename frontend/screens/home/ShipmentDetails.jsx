import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';

export default function ShipmentDetails({ route, navigation }) {
  const { shipments } = useApp();
  const shipment = useMemo(()=> shipments.find(s=>s.id===route.params?.id), [shipments, route.params]);

  if (!shipment) return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>Shipment not found</Text></View>;

  return (
    <ScrollView style={{flex:1, backgroundColor:colors.white}} contentContainerStyle={{padding: spacing(2)}}>
      <Text style={{fontWeight:'800', fontSize:22, marginBottom:12}}>Parcel Details</Text>

      {/* Ticket */}
      <View style={styles.card}>
        <Text style={{color:colors.gray700}}>Shipment Number</Text>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:4}}>
          <Text style={{fontWeight:'800'}}>{shipment.id}</Text>
          <View style={[styles.badge]}><Text style={{color:colors.white, fontWeight:'700'}}>{shipment.status}</Text></View>
        </View>
      </View>

      {/* Receiver & transporter */}
      <View style={styles.card}>
        <Text style={styles.h}>Receiver & Transporter Information</Text>
        <Text>Receiver Name{'\n'}<Text style={{fontWeight:'700'}}>{shipment.receiver}</Text></Text>
        <View style={{height:1, backgroundColor:colors.border, marginVertical:8}} />
        <Text>Transporter Name{'\n'}<Text style={{fontWeight:'700'}}>Pema Bidha</Text></Text>
      </View>

      {/* Items */}
      <View style={styles.card}>
        <Text style={styles.h}>Parcel Items</Text>
        {shipment.items.map((it, idx)=>(
          <View key={idx} style={{marginBottom:8}}>
            <Text>Category{'\n'}<Text style={{fontWeight:'700'}}>{it.category}</Text></Text>
            <Text style={{marginTop:6}}>Description{'\n'}<Text style={{fontWeight:'700'}}>{it.desc}</Text></Text>
          </View>
        ))}
      </View>

      {/* Details */}
      <View style={styles.card}>
        <Text style={styles.h}>Parcel details</Text>
        <Text>Pickup Location{'\n'}<Text style={{fontWeight:'700'}}>{shipment.from}</Text></Text>
        <Text style={{marginTop:6}}>Parcel Destination{'\n'}<Text style={{fontWeight:'700'}}>{shipment.to}</Text></Text>
        <Text style={{marginTop:6}}>Shipment Date{'\n'}<Text style={{fontWeight:'700'}}>21-Mar-2025</Text></Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h}>Payment Details</Text>
        <Text>Payment Method{'\n'}<Text style={{fontWeight:'700'}}>Cash on Delivery</Text></Text>
        <Text style={{marginTop:6}}>Delivery Fee{'\n'}<Text style={{fontWeight:'700'}}>Nu. {shipment.fee.toFixed(2)}</Text></Text>
      </View>

      <PrimaryButton title="Live Track" onPress={()=>navigation.navigate('LiveTrack')} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  card:{ backgroundColor:colors.white, borderWidth:1, borderColor:colors.border, borderRadius:radius.lg, padding:spacing(1.5), marginBottom:spacing(1.25) },
  h:{ fontWeight:'800', marginBottom:8 }
});
