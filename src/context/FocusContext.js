import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { DEFAULT_LENGTHS, durationOf } from '../utils/focus';
import { useSettings } from './SettingsContext';
import { scheduleFocusAlarm, cancelFocusAlarm, playWebBeep } from '../utils/notifications';

const FocusContext = createContext(null);

// Keeps the timer alive while you switch tabs, and shares "focus today" with the Home screen.
export function FocusProvider({ children }) {
  const { settings } = useSettings();
  const alarmOn = settings.focusAlarm;
  const tone = settings.alarmTone;
  const [lengths, setLengths] = useState(DEFAULT_LENGTHS); // minutes for each mode
  const [mode, setMode] = useState('focus'); // 'focus' | 'short' | 'long'
  const [remaining, setRemaining] = useState(DEFAULT_LENGTHS.focus * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0); // completed focus sessions
  const [focusSec, setFocusSec] = useState(0); // total focused seconds

  const endAt = useRef(0);
  const lastTick = useRef(0);
  const live = useRef({});
  live.current = { mode, sessions, lengths, remaining, alarmOn };

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      const { mode: m, sessions: n, lengths: l, remaining: prev, alarmOn: alarm } = live.current;
      const now = Date.now();
      const left = Math.max(0, Math.ceil((endAt.current - now) / 1000));

      if (m === 'focus') {
        const dt = Math.min((now - lastTick.current) / 1000, prev);
        setFocusSec((s) => s + dt);
      }
      lastTick.current = now;
      setRemaining(left);

      if (left === 0) {
        setRunning(false);
        if (alarm) {
          Vibration.vibrate([0, 300, 150, 300]);
          playWebBeep();
        }
        if (m === 'focus') {
          const done = n + 1;
          const next = done % 4 === 0 ? 'long' : 'short';
          setSessions(done);
          setMode(next);
          setRemaining(durationOf(next, l));
        } else {
          setMode('focus');
          setRemaining(durationOf('focus', l));
        }
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  const value = useMemo(() => {
    const switchTo = (m) => {
      cancelFocusAlarm();
      setRunning(false);
      setMode(m);
      setRemaining(durationOf(m, lengths));
    };
    return {
      mode, remaining, running, sessions, lengths, focusSec,
      total: durationOf(mode, lengths),
      start: () => {
        endAt.current = Date.now() + remaining * 1000;
        lastTick.current = Date.now();
        setRunning(true);
        if (alarmOn) scheduleFocusAlarm(remaining, mode, tone);
      },
      pause: () => {
        cancelFocusAlarm();
        setRunning(false);
      },
      reset: () => {
        cancelFocusAlarm();
        setRunning(false);
        setRemaining(durationOf(mode, lengths));
      },
      skip: () => switchTo(mode === 'focus' ? ((sessions + 1) % 4 === 0 ? 'long' : 'short') : 'focus'),
      selectMode: switchTo,
      // Change the length (in minutes) of one mode. Locked while the timer runs.
      setLength: (m, minutes) => {
        if (running) return;
        setLengths((prev) => ({ ...prev, [m]: minutes }));
        if (m === mode) setRemaining(minutes * 60);
      },
    };
  }, [mode, remaining, running, sessions, lengths, focusSec, alarmOn, tone]);

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

export const useFocus = () => useContext(FocusContext);
