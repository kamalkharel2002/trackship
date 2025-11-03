// src/utils/fetchAndStoreHubs.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';

export const fetchAndStoreHubs = async () => {
  try {
    const res = await fetch(`${Config.BASE_URL}/hubs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    
    const hubs = json.data;

    // store hubs in AsyncStorage
    await AsyncStorage.setItem('@hubs_data', JSON.stringify(hubs));
  } catch (err) {
    console.log('❌ Failed to fetch hubs:', err.message);
  }
};
