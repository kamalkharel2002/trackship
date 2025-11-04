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
import Config from '../../config';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = Config.BASE_URL;
const sizeOptions = ['small', 'medium', 'large'];

const ui = {
  bgSoft: '#F8FAFD',
  card: '#FFFFFF',
  ink: colors?.text || '#1C2530',
  sub: colors?.gray700 || '#5B6B7A',
  line: '#E6EEF8',
  lineSoft: '#DDEBFF',
  accent: '#3B82F6',
  danger: colors?.danger || '#E11D48',
};

function HubSelect({ label, placeholder = 'Select hub', value, onSelect }) {
  const [visible, setVisible] = useState(false);
  const [hubs, setHubs] = useState([]);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(false); // local highlight only

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
    <View style={{ marginTop: 10 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={() => { setVisible(true); setActive(true); }}
        activeOpacity={0.85}
        style={[
          styles.selectField,
          active && styles.selectFieldActive,
        ]}
      >
        <Text style={{ color: value ? ui.ink : colors.gray600 }}>
          {value ? value.hub_name : placeholder}
        </Text>
        <Text style={{ fontWeight: '700' }}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => { setVisible(false); setActive(false); }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => { setVisible(false); setActive(false); }}>
                <Text style={styles.modalClose}>Close</Text>
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
                    setActive(false);
                  }}
                  style={styles.optionRow}
                  activeOpacity={0.85}
                >
                  <Text style={{ fontWeight: '600', marginBottom: 2 }}>{item.hub_name}</Text>
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
      <Text style={styles.cardTitle}>Item {idx + 1}</Text>

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

      {/* Quick picks (optional) */}
      <View style={styles.quickRow}>
        {sizeOptions.map((s) => {
          const active = (value.size || '').toLowerCase() === s;
          return (
            <TouchableOpacity
              key={s}
              onPress={() => onChange({ ...value, size: s })}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.85}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextField
        label="Parcel Description"
        placeholder="Enter parcel description"
        value={value.desc}
        onChangeText={(v) => onChange({ ...value, desc: v })}
      />

      <View style={styles.rowJustify}>
        <Text style={styles.body}>Is fragile</Text>
        <Switch
          value={!!value.fragile}
          onValueChange={(fragile) => onChange({ ...value, fragile })}
        />
      </View>
    </View>
  );
}

export default function PlaceShipment({ navigation }) {
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
    { category: '', size: 'small', desc: '', fragile: false },
  ]);
  const [done, setDone] = useState({ visible: false, id: null });

  const addItem = () =>
    setItems((cur) => [...cur, { category: '', size: 'small', desc: '', fragile: false }]);
  const removeItem = (i) => setItems((cur) => cur.filter((_, idx) => idx !== i));
  const updateItem = (i, val) =>
    setItems((cur) => cur.map((it, idx) => (idx === i ? val : it)));

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
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.screenTitle}>Book a Shipment</Text>

      {/* Top fields — highlight handled INSIDE TextField (no wrapper) */}
      <TextField
        label="Receiver Name"
        placeholder="Name"
        value={form.receiverName}
        onChangeText={(v) => setForm({ ...form, receiverName: v })}
      />
      <TextField
        label="Receiver Contact NO."
        placeholder="+975"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(v) => setForm({ ...form, phone: v })}
      />
      <TextField
        label="Receiver Address"
        placeholder="e.g., Olokha, Thimphu"
        value={form.receiverAddress}
        onChangeText={(v) => setForm({ ...form, receiverAddress: v })}
      />

      {/* Items */}
      <View style={styles.group}>
        <View style={styles.rowJustify}>
          <Text style={styles.sectionTitle}>Parcel Items</Text>
          <Text style={styles.muted}>
            {items.length} item{items.length > 1 ? 's' : ''}
          </Text>
        </View>

        {items.map((it, idx) => (
          <View key={idx} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <Ionicons name="cube-outline" size={20} color="#60A5FA" />
                <Text style={styles.itemTitle}>Item {idx + 1}</Text>
              </View>

              {idx > 0 && (
                <TouchableOpacity
                  onPress={() => removeItem(idx)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={22} color={ui.danger} />
                </TouchableOpacity>
              )}
            </View>

            {/* Item form */}
            <ItemForm
              idx={idx}
              value={it}
              onChange={(val) => updateItem(idx, val)}
            // no onRemove here; handled by the red X above
            />
          </View>
        ))}

        {/* Dotted add button */}
        <TouchableOpacity onPress={addItem} activeOpacity={0.9} style={styles.addBtnDotted}>
          <Text style={styles.addBtnText}>＋ Add another parcel item</Text>
        </TouchableOpacity>
      </View>



      {/* Hubs */}
      <HubSelect
        label="Select Source Hub"
        placeholder="Select your nearest hub"
        value={form.hubSource}
        onSelect={(hub) => setForm({ ...form, hubSource: hub })}
      />
      <HubSelect
        label="Select Destination Hub"
        placeholder="Select your parcel destination hub"
        value={form.hubDest}
        onSelect={(hub) => setForm({ ...form, hubDest: hub })}
      />

      {/* Roadside */}
      <View style={[styles.rowJustify, { marginTop: 10 }]}>
        <Text style={styles.body}>Roadside delivery</Text>
        <Switch
          value={form.roadside}
          onValueChange={(roadside) => setForm({ ...form, roadside })}
        />
      </View>

      {form.roadside && (
        <TextField
          label="Roadside description"
          placeholder="Write roadside delivery location"
          value={form.roadsideNote}
          onChangeText={(v) => setForm({ ...form, roadsideNote: v })}
        />
      )}

      {/* Date */}
      <TouchableOpacity onPress={() => setShowDate(true)} style={styles.dateBtn} activeOpacity={0.9}>
        <Text style={styles.body}>Preferred Delivery Date</Text>
        <Text style={styles.dateValue}>{form.date.toDateString()}</Text>
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

      {/* Actions */}
      <View style={styles.actionsRow}>
        <PrimaryButton
          title="Reset"
          onPress={reset}
          variant="outline"
          color="#93C5FD"
          textStyle={{ color: '#4B5563' }}
          style={[styles.button, { marginRight: 8 }]}
        />


        <PrimaryButton
          title={submitting ? '' : 'Submit'}
          onPress={submit}
          style={[styles.button, submitting && { opacity: 0.7 }]}
          disabled={submitting}
        >
          {submitting && <ActivityIndicator />}
        </PrimaryButton>
      </View>

      <ModalDialog
        visible={done.visible}
        title="Shipment Created!"
        message="Your shipment has been created successfully."
        onConfirm={() => {
          setDone({ visible: false, id: null });
          navigation.replace('Home');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing(2),
    paddingBottom: spacing(4),
    backgroundColor: ui.bgSoft,
  },
  screenTitle: {
    fontWeight: '800',
    fontSize: 22,
    marginBottom: spacing(1),
    color: ui.ink,
  },
  label: { fontWeight: '800', marginBottom: 6, color: ui.ink },
  sectionTitle: { fontWeight: '800', color: ui.ink },
  body: { color: ui.ink },
  muted: { color: ui.sub },

  group: {
    backgroundColor: ui.card,
    borderWidth: 1,
    borderColor: ui.lineSoft,
    borderRadius: radius.lg,
    padding: spacing(1.25),
    marginTop: spacing(1),
    gap: 8,
  },

  // dotted add button
  addBtnDotted: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: ui.ink,
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: ui.card,
  },
  addBtnText: { fontWeight: '800', color: '#335CFF' },

  itemCard: {
    backgroundColor: ui.card,
    borderWidth: 1,
    borderColor: ui.line,
    borderRadius: radius.lg,
    padding: spacing(1),
    marginTop: 8,
  },
  cardTitle: { fontWeight: '800', marginBottom: 6, color: ui.ink },

  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#DDE7FB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: '#8FB6FF',
    backgroundColor: '#F0F6FF',
  },
  chipText: { color: ui.ink, fontWeight: '600', textTransform: 'capitalize' },
  chipTextActive: { color: '#2349E6' },

  rowJustify: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  dateBtn: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: ui.line,
    paddingHorizontal: spacing(1.5),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: ui.card,
  },
  dateValue: { fontWeight: '700', color: ui.ink },

  selectField: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: ui.line,
    paddingHorizontal: spacing(1.5),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: ui.card,
  },
  selectFieldActive: {
    borderColor: '#8FB6FF',
    backgroundColor: '#F7FAFF',
    elevation: 1,
    shadowColor: '#0050FF',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 27, 33, 0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: ui.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing(1.25),
    maxHeight: '75%',
  },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: ui.ink },
  modalClose: { fontWeight: '700', color: ui.ink },

  search: {
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: ui.line,
    paddingHorizontal: spacing(1),
    marginTop: 10,
    backgroundColor: ui.card,
  },
  optionRow: {
    padding: spacing(1),
    borderWidth: 1,
    borderColor: ui.line,
    borderRadius: radius.md,
    backgroundColor: ui.card,
  },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing(1), alignItems: 'center' },
  button: { flex: 1 },
  btnGhost: { marginRight: 8, backgroundColor: '#EEF2F7' },
  itemContainer: {
    marginTop: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontWeight: '800',
    color: '#60A5FA',
    marginLeft: 6,
    fontSize: 16,
  },
});
