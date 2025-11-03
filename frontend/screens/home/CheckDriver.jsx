import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import Select from '../../components/Select';

const LOCATIONS = [
  'Shaba, Paro', 'Bondey, Paro', 'Thimphu', 'Taba, Thimphu', 'Punakha', 'Paro Town'
];

const ALL_DRIVERS = [
  { id:1, name:'Sonam Dorji', vehicle:'Coster Bus',    from:'Shaba, Paro', to:'Thimphu',     status:'Available' },
  { id:2, name:'Jigme Choda', vehicle:'Alto-800',      from:'Bondey, Paro', to:'Taba, Thimphu', status:'Available' },
];

function DriverCard({ d }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}><Text style={{fontSize:18}}>🚚</Text></View>
      <View style={{flex:1}}>
        <Text style={styles.name}>{d.name}</Text>
        <Text style={styles.vehicle}>{d.vehicle}</Text>
      </View>
      <View style={[styles.badge, d.status==='Available' ? styles.good : styles.bad]}>
        <Text style={styles.badgeTxt}>{d.status}</Text>
      </View>
    </View>
  );
}

export default function CheckDriver(){
  const [start, setStart] = useState('');
  const [dest, setDest] = useState('');

  const list = useMemo(()=>{
    // simple filter: match from & to when chosen, otherwise show all
    return ALL_DRIVERS.filter(d => (!start || d.from===start) && (!dest || d.to===dest));
  }, [start, dest]);

  return (
    <ScrollView style={{flex:1, backgroundColor:colors.white}} contentContainerStyle={{padding:spacing(2)}}>
      <Text style={styles.title}>Driver Availability</Text>
      <View style={{height:1, backgroundColor:colors.border, marginBottom:spacing(2)}} />

      <Select
        label="Select Starting Location"
        placeholder="Select the starting location"
        value={start}
        onChange={setStart}
        options={LOCATIONS}
      />
      <Select
        label="Select Destination Location"
        placeholder="Select the Destination location"
        value={dest}
        onChange={setDest}
        options={LOCATIONS}
      />

      <Text style={styles.count}>Available Drivers ({list.length})</Text>

      {list.map(d => <DriverCard key={d.id} d={d} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  brand:{ alignSelf:'center', fontWeight:'800', color:'#FFC043', marginBottom: spacing(1) },
  title:{ fontSize:28, fontWeight:'800', color: colors.gray700, marginBottom: spacing(1) },
  count:{ textAlign:'center', fontWeight:'700', marginVertical: spacing(1) },

  card:{
    backgroundColor:'#EAF6EE', // soft green like mock
    borderRadius: radius.xl,
    padding: spacing(1.25),
    flexDirection:'row',
    alignItems:'center',
    marginBottom: spacing(1),
  },
  iconWrap:{ width:44, height:44, borderRadius:12, alignItems:'center', justifyContent:'center', backgroundColor:'#E6F1FF', marginRight:12 },
  name:{ fontWeight:'700', fontSize:16, color:colors.gray700 },
  vehicle:{ color:colors.gray700, marginTop:4 },
  badge:{ paddingVertical:6, paddingHorizontal:12, borderRadius: radius.pill },
  badgeTxt:{ color: colors.white, fontWeight:'800' },
  good:{ backgroundColor:'#38A169' },
  bad:{ backgroundColor:'#EF4444' },
});
