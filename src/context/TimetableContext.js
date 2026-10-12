import React, { createContext, useContext, useMemo } from 'react';
import { usePersistentState } from '../utils/storage';

const TimetableContext = createContext(null);

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// A class looks like: { id, name, room, day (0-6), start 'HH:MM', end 'HH:MM', color }
export function TimetableProvider({ children }) {
  const [classes, setClasses, loaded] = usePersistentState('classes', []);

  const value = useMemo(
    () => ({
      classes,
      loaded,
      addClasses: (list) => setClasses((all) => [...all, ...list.map((c) => ({ ...c, id: makeId() }))]),
      updateClass: (id, patch) => setClasses((all) => all.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      removeClass: (id) => setClasses((all) => all.filter((c) => c.id !== id)),
      clearClasses: () => setClasses([]),
    }),
    [classes, loaded]
  );

  return <TimetableContext.Provider value={value}>{children}</TimetableContext.Provider>;
}

export const useTimetable = () => useContext(TimetableContext);
