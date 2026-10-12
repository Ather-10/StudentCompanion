import React, { createContext, useContext, useMemo } from 'react';
import { usePersistentState } from '../utils/storage';

const ExamsContext = createContext(null);

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function ExamsProvider({ children }) {
  const [exams, setExams, loaded] = usePersistentState('exams', []);

  const value = useMemo(
    () => ({
      exams,
      loaded,
      addExam: (e) => setExams((all) => [...all, { ...e, id: makeId() }]),
      updateExam: (id, patch) => setExams((all) => all.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      removeExam: (id) => setExams((all) => all.filter((e) => e.id !== id)),
      clearExams: () => setExams([]),
    }),
    [exams, loaded]
  );

  return <ExamsContext.Provider value={value}>{children}</ExamsContext.Provider>;
}

export const useExams = () => useContext(ExamsContext);
