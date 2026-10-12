import React, { createContext, useContext, useMemo } from 'react';
import { usePersistentState } from '../utils/storage';

const SettingsContext = createContext(null);

export const DEFAULT_SETTINGS = {
  name: '',
  school: '',
  photo: null, // small profile picture (saved on this phone)
  scale: '4.0', // '4.0' | '%'
  classReminders: true,
  leadMin: 10, // minutes before a class
  examReminders: true,
  examWhen: 'both', // 'before' | 'day' | 'both'
  focusAlarm: true,
  alarmTone: 'classic', // see src/utils/tones.js
};

export function SettingsProvider({ children }) {
  const [stored, setStored, loaded] = usePersistentState('settings', {});
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...stored }), [stored]);

  const value = useMemo(
    () => ({
      settings,
      loaded,
      scale: settings.scale,
      update: (patch) => setStored((s) => ({ ...s, ...patch })),
      reset: () => setStored({}),
    }),
    [settings, loaded]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
