import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius, spacing } from '../../theme';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import ModalDialog from '../../components/ModalDialog';
import { useApp } from '../../context/AppContext';

const categoryOptions = ['Electronic','Documents','Clothes','Books','Gift'];

function ItemForm({ idx, value, onChange, onRemove }) {
  return (
    <View style={styles.itemCard}>
      <Text style={{fontWeight:'800', marginBottom:6}}>Item {idx+1}</Text>
      <TextField label="Parcel Category" placeholder="Select Parcel Category (type one)" value={value.category} onChangeText={(v)=>onChange({...value, category:v})} />
      <TextField label="Parcel Description" placeholder="Enter parcel description" value={value.desc} onChangeText={(v)=>onChange({...value, desc:v})} />
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:6}}>
        <Text>Is fragile</Text>
        <Switch value={value.fragile} onValueChange={(fragile)=>onChange({...value, fragile})} />
      </View>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}><Text style={{color:colors.danger, fontWeight:'700'}}>Remove</Text></TouchableOpacity>
      )}
    </View>
  );
}

export default function PlaceShipment({ navigation }) {
  const { createShipment } = useApp();

  const [form, setForm] = useState({
    receiverName:'', phone:'', hubSource:'', hubDest:'',
    to:'', from:'', roadside:false, roadsideNote:'', date:new Date(),
  });
  const [showDate, setShowDate] = useState(false);
  const [items, setItems] = useState([{ category:'Electronic', desc:'It is a fragile item, and consist of Phone LCD.', fragile:true }]);
  const [done, setDone] = useState({ visible:false, id:null });

  const addItem = () => setItems([...items, { category:'', desc:'', fragile:false }]);
  const removeItem = (i) => setItems(items.filter((_,idx)=>idx!==i));
  const updateItem = (i, val) => { const next=[...items]; next[i]=val; setItems(next); };

  const reset = () => {
    setForm({ receiverName:'', phone:'', hubSource:'', hubDest:'', roadside:false, roadsideNote:'', date:new Date() });
    setItems([{ category:'', desc:'', fragile:false }]);
  };

  const submit = () => {
    // Basic validation
    if (!form.receiverName || !form.phone) return alert('Complete all required fields.');
    const id = createShipment({
      from: form.from, to: form.to, receiver: form.receiverName, phone: form.phone,
      items, date: form.date, roadside: form.roadside, roadsideNote: form.roadsideNote
    });
    setDone({ visible:true, id });
  };

  return (
    <ScrollView contentContainerStyle={{padding: spacing(2), paddingBottom: spacing(4)}}>
      <Text style={{fontWeight:'800', fontSize:22, marginBottom:spacing(1)}}>Book a Shipment</Text>

      <TextField label="Receiver Name" placeholder="Name" value={form.receiverName} onChangeText={(v)=>setForm({...form, receiverName:v})} />
      <TextField label="Receiver Contact NO." placeholder="+975" keyboardType='phone-pad' value={form.phone} onChangeText={(v)=>setForm({...form, phone:v})} />

      {/* Items */}
      <View style={styles.group}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={{fontWeight:'800'}}>Parcel Items</Text>
          <Text style={{color:colors.gray700}}>{items.length} item</Text>
        </View>

        {items.map((it, idx)=>(
          <ItemForm key={idx} idx={idx} value={it} onChange={(val)=>updateItem(idx,val)} onRemove={idx>0 ? ()=>removeItem(idx) : undefined} />
        ))}

        <TouchableOpacity onPress={addItem} style={styles.addBtn}>
          <Text style={{fontWeight:'800'}}>＋ Add another parcel item</Text>
        </TouchableOpacity>
      </View>

      <TextField label="Select Source Hub" placeholder="Select your nearest hub" value={form.hubSource} onChangeText={(v)=>setForm({...form, hubSource:v})} />
      <TextField label="Select Destination Hub" placeholder="Select your parcel destination hub" value={form.hubDest} onChangeText={(v)=>setForm({...form, hubDest:v})} />

      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:6}}>
        <Text>Roadside delivery</Text>
        <Switch value={form.roadside} onValueChange={(roadside)=>setForm({...form, roadside})} />
      </View>
      {form.roadside && (
        <TextField label="Roadside description" placeholder="write roadside delivery location" value={form.roadsideNote} onChangeText={(v)=>setForm({...form, roadsideNote:v})} />
      )}

      <TouchableOpacity onPress={()=>setShowDate(true)} style={styles.dateBtn}>
        <Text>Preferred Delivery Date</Text>
        <Text style={{fontWeight:'700'}}>{form.date.toDateString()}</Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker value={form.date} mode="date" onChange={(e,d)=>{ setShowDate(false); if (d) setForm({...form, date:d}); }} />
      )}

      <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:spacing(1)}}>
        <PrimaryButton title="Reset" onPress={reset} style={{flex:1, marginRight:8, backgroundColor:colors.gray300}} />
        <PrimaryButton title="Submit" onPress={submit} style={{flex:1, marginLeft:8}} />
      </View>

      <ModalDialog
        visible={done.visible}
        title="Shipment Details Submitted!"
        message={`Shipment Number: ${done.id}\n\nYour shipment details have been submitted successfully. You'll be notified with status updates once it's processed.`}
        onConfirm={()=>{ 
          setDone({ visible:false, id:null }); 
          // Go back to dashboard
        }}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  group:{ backgroundColor: '#F7FBFF', borderWidth:1, borderColor: '#DDEBFF', borderRadius: radius.lg, padding: spacing(1.25), marginTop: spacing(1) },
  addBtn:{ borderWidth:1, borderColor: '#DDEBFF', borderRadius: radius.pill, padding:12, alignItems:'center', marginTop:8, backgroundColor: colors.white },
  itemCard:{ backgroundColor: colors.white, borderWidth:1, borderColor: '#E6EEF8', borderRadius: radius.lg, padding: spacing(1), marginTop:8 },
  removeBtn:{ alignSelf:'flex-end', marginTop:6 },
  dateBtn:{ height:48, borderRadius:radius.md, borderWidth:1, borderColor: '#E6EEF8', paddingHorizontal: spacing(1.5), alignItems:'center', justifyContent:'space-between', flexDirection:'row', marginTop:6 },
});
