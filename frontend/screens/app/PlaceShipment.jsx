import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';
import Field from '../../components/Field';
import PrimaryButton from '../../components/PrimaryButton';
import ParcelItem from '../../components/ParcelItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, radius } from '../../utils/theme';

export default function PlaceShipment() {
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('+975');
  const [sourceHub, setSourceHub] = useState('');
  const [destHub, setDestHub] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [roadside, setRoadside] = useState('');
  const [date, setDate] = useState('21-Mar-2025');
  const [items, setItems] = useState([{ category: '', description: '' }]);

  const onAddItem = () => setItems(prev => [...prev, { category: '', description: '' }]);
  const onChangeItem = (idx, next) => { const copy = [...items]; copy[idx] = next; setItems(copy); };
  const onRemoveItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const submit = async () => {
    if (!receiverName || !receiverPhone || !sourceHub || !destHub || items.some(i => !i.category || !i.description)) {
      Alert.alert('Missing info', 'Please complete all required fields.');
      return;
    }
    // TODO: POST to backend here
    Alert.alert('Success', 'Shipment placed (mock).');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title="Book a Shipment" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        <View style={styles.card}>
          <Field label="Receiver Name" value={receiverName} onChangeText={setReceiverName} placeholder="Name" />
          <Field label="Receiver Contact NO." value={receiverPhone} onChangeText={setReceiverPhone} keyboardType="phone-pad" placeholder="+975" />

          <Text style={styles.sectionTitle}>Parcel Items</Text>
          {items.map((it, idx) => (
            <ParcelItem
              key={idx}
              index={idx}
              item={it}
              onChange={(next) => onChangeItem(idx, next)}
              onRemove={() => onRemoveItem(idx)}
            />
          ))}

          <TouchableOpacity onPress={onAddItem} style={styles.addDashed}>
            <Text style={styles.addTxt}><Ionicons name="add" />  Add another parcel item</Text>
          </TouchableOpacity>

          <Field label="Select Source Hub" value={sourceHub} onChangeText={setSourceHub} placeholder="Select your nearest hub" />
          <Field label="Select Destination Hub" value={destHub} onChangeText={setDestHub} placeholder="Select your parcel destination hub" />
          <Field label="Current Location" value={currentLocation} onChangeText={setCurrentLocation} placeholder="Shaba, Paro" />

          <Text style={styles.smallLabel}>Roadside delivery</Text>
          <TextInput
            placeholder="write roadside delivery location"
            value={roadside}
            onChangeText={setRoadside}
            style={styles.textArea}
            multiline
          />

          <Field label="Preferred Delivery Date" value={date} onChangeText={setDate} placeholder="21-Mar-2025" />

          <View style={{ flexDirection: 'row' }}>
            <PrimaryButton
              title="Reset"
              style={{ flex: 1, backgroundColor: '#E5E7EB' }}
              onPress={() => {
                setReceiverName(''); setReceiverPhone('+975'); setItems([{ category: '', description: '' }]);
                setSourceHub(''); setDestHub(''); setCurrentLocation(''); setRoadside(''); setDate('21-Mar-2025');
              }}
            />
            <PrimaryButton title="Submit" style={{ flex: 1, marginLeft: 10 }} onPress={submit} />
          </View>
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: radius.xl, padding: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.sm },
  addDashed: {
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.brand,
    borderRadius: radius.lg, paddingVertical: 12, alignItems: 'center', marginBottom: spacing.md
  },
  addTxt: { color: colors.brand, fontWeight: '700' },
  smallLabel: { color: colors.text, marginBottom: 6, fontWeight: '600' },
  textArea: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', height: 80, textAlignVertical: 'top', marginBottom: spacing.md
  },
});
