import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

// tiny UUID (no extra dep if you prefer: Date.now().toString())
function uid() { try { return uuidv4(); } catch { return `${Date.now()}${Math.random()}`; } }

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  // fake auth
  const [user, setUser] = useState(null); // {role:'customer'|'transporter', name, email}
  const login = (username, password) => {
    if (!username || !password) { Alert.alert('Missing', 'Enter username and password'); return false; }
    setUser({ role: 'customer', name: username, email: `${username}@example.com` });
    return true;
  };
  const logout = () => setUser(null);

  // seed shipments for Home filters
  const [shipments, setShipments] = useState([
    { id:'AB1234XY78', status:'In-Transit', fee:150, from:'Shaba, Paro', to:'Taba, Thimphu', receiver:'Karma Dorji', phone:'178329738', items:[{category:'Electronic', desc:'Phone LCD', fragile:true}] },
    { id:'PKG0002', status:'Pending', fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'17328738', items:[{category:'Books', desc:'2 textbooks', fragile:false}] },
    { id:'PKG0003', status:'To Receive', fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'019381984', items:[{category:'Clothes', desc:'Winter jacket', fragile:false}] },
    { id:'PKG0004', status:'Received', fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'17282329', items:[{category:'Gift', desc:'Souvenir', fragile:false}] },
    { id:'PKG0005', status:'Canceled', fee:150, from:'Bonday, Paro', to:'Taba, Thimphu', receiver:'Mon Maya', phone:'17282329', items:[{category:'Electronic', desc:'Old laptop', fragile:false}] },
  ]);

  // notifications
  const [notifications, setNotifications] = useState([
    { id: uid(), title:'Your parcel PKG001 is on the way and will arrive soon!', tone:'info', createdAt: Date.now() - 86400000 },
    { id: uid(), title:'Parcel PKG003 has been delivered successfully.', tone:'success', createdAt: Date.now() - 2*86400000 },
    { id: uid(), title:'Your shipment PKG002 has been accepted by the Hub Coordinator.', tone:'warning', createdAt: Date.now() - 2*86400000 },
  ]);
  const pushNotification = (title, tone='info') => setNotifications(prev => [{ id: uid(), title, tone, createdAt: Date.now() }, ...prev]);

  // place shipment
  const createShipment = (payload) => {
    const id = `PKG${String(Math.floor(1000 + Math.random()*9000))}`;
    const entry = { id, status:'Pending', fee: payload.fee ?? 150, ...payload };
    setShipments(prev => [entry, ...prev]);
    pushNotification(`Shipment ${id} submitted. We'll notify you with updates.`, 'success');
    return id;
  };

  const value = useMemo(() => ({
    user, login, logout,
    shipments, setShipments, createShipment,
    notifications, pushNotification
  }), [user, shipments, notifications]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
export const useApp = () => useContext(AppCtx);
