import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Like useState, but the value is saved on the phone and restored when the app opens again.
// Returns [value, setValue, loaded].
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem('sc:' + key)
      .then((raw) => {
        if (alive && raw != null) setValue(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [key]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem('sc:' + key, JSON.stringify(value)).catch(() => {});
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}
