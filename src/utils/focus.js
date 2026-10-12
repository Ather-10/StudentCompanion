export const MODES = {
  focus: { label: 'Focus', full: 'Focus' },
  short: { label: 'Short', full: 'Short break' },
  long: { label: 'Long', full: 'Long break' },
};

export const DEFAULT_LENGTHS = { focus: 25, short: 5, long: 15 };

// Allowed range (in minutes) for each mode
export const LIMITS = { focus: [1, 180], short: [1, 60], long: [1, 90] };

// Seconds for a mode, given the chosen lengths (in minutes)
export const durationOf = (mode, lengths) => lengths[mode] * 60;

// 1500 -> "25:00"
export const formatClock = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

// 5100 -> "1h 25m", 600 -> "10m"
export const formatFocus = (sec) => {
  const m = Math.floor(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
};
