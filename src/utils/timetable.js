import { ACCENT } from '../theme/colors';

export const DAYS = [
  { short: 'Mon', long: 'Monday' },
  { short: 'Tue', long: 'Tuesday' },
  { short: 'Wed', long: 'Wednesday' },
  { short: 'Thu', long: 'Thursday' },
  { short: 'Fri', long: 'Friday' },
  { short: 'Sat', long: 'Saturday' },
  { short: 'Sun', long: 'Sunday' },
];

export const COLORS = [ACCENT.violet, ACCENT.mint, ACCENT.amber, ACCENT.rose];

// 0 = Monday ... 6 = Sunday
export const todayIndex = () => (new Date().getDay() + 6) % 7;

export const isValidTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

export const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// "14:30" -> "2:30 PM"
export const format12 = (t) => {
  if (!isValidTime(t)) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

// "0930" -> "09:30" while typing
export const formatTimeInput = (raw) => {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + ':' + d.slice(2) : d;
};

export const classesForDay = (classes, day) =>
  classes.filter((c) => c.day === day).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
