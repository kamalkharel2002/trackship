// src/context/AppContext.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import Config from '../config'; // must expose BASE_URL

// tiny UUID
function uid() { try { return uuidv4(); } catch { return `${Date.now()}${Math.random()}`; } }

// ---- storage keys (match your Login) ----
const KEY_ACCESS  = '@access_token';
const KEY_REFRESH = '@refresh_token';
const KEY_USER    = '@user';

// ---- safe base URL helpers ----
const BASE = (Config?.BASE_URL || '').replace(/\/+$/, '');         // strip trailing /
const urlOf = (path) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`;

const AppCtx = createContext(undefined);

// --- helpers to map API -> UI ---
const apiStatusToUi = (raw) => {
  if (!raw) return 'Pending';
  const s = String(raw).toLowerCase().trim();
  if (s === 'pending') return 'Pending';
  if (s === 'in_transit' || s === 'in-transit' || s === 'transit') return 'In-Transit';
  if (s === 'to_receive' || s === 'to-receive' || s === 'awaiting_pickup') return 'To Receive';
  if (s === 'received' || s === 'delivered' || s === 'completed') return 'Received';
  if (s === 'canceled' || s === 'cancelled' || s === 'rejected') return 'Canceled';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const mapApiShipment = (s) => ({
  id: s?.shipment_id ?? '-',
  status: apiStatusToUi(s?.status),
  fee: Number(s?.total_price ?? 0) || 0,
  from: s?.source_hub_name ?? s?.source_hub_id ?? '',
  to: s?.dest_hub_name ?? s?.dest_hub_id ?? '',
  receiver: s?.receiver_name ?? '',
  phone: s?.receiver_phone ?? '',
  items: Array.isArray(s?.parcels)
    ? s.parcels.map(p => ({
        category: p?.category ?? '',
        desc: p?.parcel_description ?? '',
        fragile: !!p?.is_fragile,
      }))
    : [],
});

// ---- token utilities ----
async function tryRefresh() {
  const refreshToken = await AsyncStorage.getItem(KEY_REFRESH);
  if (!refreshToken) return false;

  const res = await fetch(urlOf('/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  let json = null; try { json = await res.json(); } catch {}

  if (!res.ok || !json?.success) return false;

  // be flexible with backend shapes
  const newAccess  = json?.data?.access_token || json?.access_token || json?.token;
  const newRefresh = json?.data?.refresh_token || json?.refresh_token;

  if (newAccess)  await AsyncStorage.setItem(KEY_ACCESS, newAccess);
  if (newRefresh) await AsyncStorage.setItem(KEY_REFRESH, newRefresh);

  return !!newAccess;
}

async function fetchWithAuth(path, init = {}, retry = true) {
  const access = await AsyncStorage.getItem(KEY_ACCESS);

  const headers = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  };

  const res = await fetch(urlOf(path), { ...init, headers });

  if (res.status === 401 && retry) {
    const ok = await tryRefresh();
    if (ok) return fetchWithAuth(path, init, false); // retry once after refresh
  }

  return res;
}

export function AppProvider({ children }) {
  // user state (hydrate from storage so Profile etc. can read it)
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_USER);
        if (raw) setUser(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  const logout = async () => {
    await AsyncStorage.multiRemove([KEY_ACCESS, KEY_REFRESH, KEY_USER]);
    setUser(null);
  };

  // seed list so UI shows something before first fetch
  const [shipments, setShipments] = useState([
    { id:'AB1234XY78', status:'In-Transit', fee:150, from:'Shaba, Paro', to:'Taba, Thimphu', receiver:'Karma Dorji', phone:'178329738', items:[{category:'Electronic', desc:'Phone LCD', fragile:true}] },
    { id:'PKG0002', status:'Pending',   fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'17328738', items:[{category:'Books', desc:'2 textbooks', fragile:false}] },
    { id:'PKG0003', status:'To Receive',fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'019381984', items:[{category:'Clothes', desc:'Winter jacket', fragile:false}] },
    { id:'PKG0004', status:'Received',  fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'17282329', items:[{category:'Gift', desc:'Souvenir', fragile:false}] },
    { id:'PKG0005', status:'Canceled',  fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'17282329', items:[{category:'Electronic', desc:'Old laptop', fragile:false}] },
  ]);

  // notifications (unchanged)
  const [notifications, setNotifications] = useState([
    { id: uid(), title:'Your parcel PKG001 is on the way and will arrive soon!', tone:'info', createdAt: Date.now() - 86400000 },
    { id: uid(), title:'Parcel PKG003 has been delivered successfully.', tone:'success', createdAt: Date.now() - 2*86400000 },
    { id: uid(), title:'Your shipment PKG002 has been accepted by the Hub Coordinator.', tone:'warning', createdAt: Date.now() - 2*86400000 },
  ]);
  const pushNotification = (title, tone='info') =>
    setNotifications(prev => [{ id: uid(), title, tone, createdAt: Date.now() }, ...prev]);

  // local create (kept for UX)
  const createShipment = (payload) => {
    const id = `PKG${String(Math.floor(1000 + Math.random()*9000))}`;
    const entry = { id, status:'Pending', fee: payload.fee ?? 150, ...payload };
    setShipments(prev => [entry, ...prev]);
    pushNotification(`Shipment ${id} submitted. We'll notify you with updates.`, 'success');
    return id;
  };

  // --- fetch shipments with auth + auto refresh ---
  const fetchShipments = async () => {
    try {
      const res  = await fetchWithAuth('/shipments', { method: 'GET' });
      const text = await res.text();
      let json = null; try { json = JSON.parse(text); } catch {}

      if (res.status === 401) {
        // refresh failed already; force re-login
        await logout();
        Alert.alert('Session expired', 'Please log in again.');
        return;
      }

      if (!res.ok || !json?.success) {
        const msg = json?.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      const mapped = Array.isArray(json.data) ? json.data.map(mapApiShipment) : [];
      setShipments(mapped);
    } catch (err) {
      console.log('Fetch shipments failed:', err?.message || String(err));
      Alert.alert('Network Error', 'Unable to load shipments right now.');
    }
  };

  // load on app start
  useEffect(() => { fetchShipments(); }, []);

  const value = useMemo(() => ({
    user, setUser, logout,
    shipments, setShipments, createShipment,
    notifications, pushNotification,
    fetchShipments,
  }), [user, shipments, notifications]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// Safer hook with a friendly error if provider is missing
export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
};
