import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing } from '../../theme';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import ModalDialog from '../../components/ModalDialog';
import Config from '../../config'


const API_BASE_URL = Config.BASE_URL;
const categoryOptions = ['Electronics', 'Documents', 'Clothes', 'Books', 'Gift'];
const sizeOptions = ['small', 'medium', 'large'];

function HubSelect({ label, placeholder = 'Select hub', value, onSelect }) {
  const [visible, setVisible] = useState(false);
  const [hubs, setHubs] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@hubs_data');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed : (parsed?.data ?? []);
        setHubs(Array.isArray(list) ? list : []);
      } catch (e) {
        console.warn('Failed to load hubs_data:', e);
        setHubs([]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return hubs;
    const k = q.toLowerCase();
    return hubs.filter(h => (h.hub_name || '').toLowerCase().includes(k));
  }, [hubs, q]);

  return (
    <View style={{ marginTop: 6 }}>
      <Text style={{ fontWeight: '800', marginBottom: 6 }}>{label}</Text>

      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.selectField}
        activeOpacity={0.8}
      >
        <Text style={{ color: value ? colors.text : colors.gray600 }}>
          {value ? value.hub_name : placeholder}
        </Text>
        <Text style={{ fontWeight: '700' }}>▾</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '800' }}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={{ fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Search hub…"
              value={q}
              onChangeText={setQ}
              style={styles.search}
              placeholderTextColor={colors.gray600}
            />

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.hub_id}
              style={{ marginTop: 6 }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect?.(item);
                    setVisible(false);
                    setQ('');
                  }}
                  style={styles.optionRow}
                >
                  <Text style={{ fontWeight: '600' }}>{item.hub_name}</Text>
                  <Text style={{ color: colors.gray600, fontSize: 12 }} numberOfLines={1}>
                    {item.address}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <Text style={{ color: colors.gray700 }}>No hubs found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ItemForm({ idx, value, onChange, onRemove }) {
  return (
    <View style={styles.itemCard}>
      <Text style={{ fontWeight: '800', marginBottom: 6 }}>Item {idx + 1}</Text>

      <TextField
        label="Parcel Category"
        placeholder="e.g., Electronics"
        value={value.category}
        onChangeText={(v) => onChange({ ...value, category: v })}
      />

      <TextField
        label="Size"
        placeholder="small | medium | large"
        value={value.size}
        onChangeText={(v) => onChange({ ...value, size: v })}
      />

      <TextField
        label="Parcel Description"
        placeholder="Enter parcel description"
        value={value.desc}
        onChangeText={(v) => onChange({ ...value, desc: v })}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <Text>Is fragile</Text>
        <Switch value={!!value.fragile} onValueChange={(fragile) => onChange({ ...value, fragile })} />
      </View>

      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Text style={{ color: colors.danger, fontWeight: '700' }}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function PlaceShipment() {
  const [form, setForm] = useState({
    receiverName: '',
    phone: '',
    receiverAddress: '',
    hubSource: null,
    hubDest: null,
    roadside: false,
    roadsideNote: '',
    date: new Date(),
  });

  const [showDate, setShowDate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([
    { category: 'Electronics', size: 'medium', desc: 'Laptop computer', fragile: true },
  ]);
  const [done, setDone] = useState({ visible: false, id: null });

  const addItem = () => setItems([...items, { category: '', size: 'small', desc: '', fragile: false }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, val) => {
    const next = [...items];
    next[i] = val;
    setItems(next);
  };

  const reset = () => {
    setForm({
      receiverName: '',
      phone: '',
      receiverAddress: '',
      hubSource: null,
      hubDest: null,
      roadside: false,
      roadsideNote: '',
      date: new Date(),
    });
    setItems([{ category: '', size: 'small', desc: '', fragile: false }]);
  };

  const computeTotalPrice = (parcels) => {
    const base = 10;
    let total = base;
    for (const p of parcels) {
      if (p.fragile) total += 2;
      if (p.size === 'medium') total += 3;
      if (p.size === 'large') total += 6;
    }
    return Number(total.toFixed(2));
  };

  const buildPayload = () => {
    const parcels = items.map((it) => ({
      category: (it.category || '').trim() || 'Unspecified',
      size: (it.size || 'small').toLowerCase(),
      is_fragile: !!it.fragile,
      parcel_description: it.desc || '',
    }));

    const delivery_type = form.roadside ? 'roadside_pickup' : 'hub_to_hub';

    return {
      receiver_name: form.receiverName,
      receiver_phone: form.phone,
      receiver_address: form.receiverAddress || form.roadsideNote || '',
      source_hub_id: form.hubSource?.hub_id,
      dest_hub_id: form.hubDest?.hub_id,
      delivery_type,
      total_price: computeTotalPrice(parcels),
      parcels,
    };
  };

  const submit = async () => {
    if (!form.receiverName || !form.phone || !form.hubSource?.hub_id || !form.hubDest?.hub_id) {
      Alert.alert('Missing info', 'Complete required fields: name, phone, hubs.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = buildPayload();
      const token = (await AsyncStorage.getItem('@access_token'))?.replace(/"/g, '') || '';

      const res = await fetch(`${API_BASE_URL}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(`Failed to create shipment (${res.status}). ${errTxt}`);
      }

      const data = await res.json();
      setDone({ visible: true, id: data?.id || data?.shipment_id || 'N/A' });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message || 'Failed to create shipment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(4) }}>
      <Text style={{ fontWeight: '800', fontSize: 22, marginBottom: spacing(1) }}>Book a Shipment</Text>

      <TextField label="Receiver Name" placeholder="Name" value={form.receiverName} onChangeText={(v) => setForm({ ...form, receiverName: v })} />
      <TextField label="Receiver Contact NO." placeholder="+975" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
      <TextField label="Receiver Address" placeholder="123 Main St, City" value={form.receiverAddress} onChangeText={(v) => setForm({ ...form, receiverAddress: v })} />

      <View style={styles.group}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>Parcel Items</Text>
          <Text style={{ color: colors.gray700 }}>{items.length} item</Text>
        </View>

        {items.map((it, idx) => (
          <ItemForm key={idx} idx={idx} value={it} onChange={(val) => updateItem(idx, val)} onRemove={idx > 0 ? () => removeItem(idx) : undefined} />
        ))}

        <TouchableOpacity onPress={addItem} style={styles.addBtn}>
          <Text style={{ fontWeight: '800' }}>＋ Add another parcel item</Text>
        </TouchableOpacity>
      </View>

      <HubSelect label="Select Source Hub" placeholder="Select your nearest hub" value={form.hubSource} onSelect={(hub) => setForm({ ...form, hubSource: hub })} />
      <HubSelect label="Select Destination Hub" placeholder="Select your parcel destination hub" value={form.hubDest} onSelect={(hub) => setForm({ ...form, hubDest: hub })} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <Text>Roadside delivery</Text>
        <Switch value={form.roadside} onValueChange={(roadside) => setForm({ ...form, roadside })} />
      </View>

      {form.roadside && (
        <TextField label="Roadside description" placeholder="Write roadside delivery location" value={form.roadsideNote} onChangeText={(v) => setForm({ ...form, roadsideNote: v })} />
      )}

      <TouchableOpacity onPress={() => setShowDate(true)} style={styles.dateBtn}>
        <Text>Preferred Delivery Date</Text>
        <Text style={{ fontWeight: '700' }}>{form.date.toDateString()}</Text>
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={form.date}
          mode="date"
          onChange={(e, d) => {
            setShowDate(false);
            if (d) setForm({ ...form, date: d });
          }}
        />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing(1), alignItems: 'center' }}>
        <PrimaryButton title="Reset" onPress={reset} style={{ flex: 1, marginRight: 8, backgroundColor: colors.gray300 }} />
        <PrimaryButton title={submitting ? '' : 'Submit'} onPress={submit} style={{ flex: 1, marginLeft: 8, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
          {submitting && <ActivityIndicator />}
        </PrimaryButton>
      </View>

      <ModalDialog
        visible={done.visible}
        title="Shipment Created!"
        message={`Shipment Number: ${done.id}\n\nYour shipment has been created successfully.`}
        onConfirm={() => setDone({ visible: false, id: null })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#DDEBFF',
    borderRadius: radius.lg,
    padding: spacing(1.25),
    marginTop: spacing(1),
  },
  addBtn: {
    borderWidth: 1,
    borderColor: '#DDEBFF',
    borderRadius: radius.pill,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: colors.white,
  },
  itemCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    borderRadius: radius.lg,
    padding: spacing(1),
    marginTop: 8,
  },
  removeBtn: { alignSelf: 'flex-end', marginTop: 6 },
  dateBtn: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    paddingHorizontal: spacing(1.5),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 6,
  },
  selectField: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    paddingHorizontal: spacing(1.5),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 27, 33, 0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing(1.25),
    maxHeight: '75%',
  },
  search: {
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    paddingHorizontal: spacing(1),
    marginTop: 10,
  },
  optionRow: {
    padding: spacing(1),
    borderWidth: 1,
    borderColor: '#E6EEF8',
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
});
