import { ACCENT } from '../theme/colors';
import { DAYS, toMinutes } from './timetable';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// An exam looks like: { id, subject, day, month (0-11), year, time ('' or 'HH:MM'), location, color }
const startOfToday = () => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};

export const examDate = (e) => new Date(e.year, e.month, e.day);

// Whole days from today until the exam (0 = today, negative = already passed)
export const daysUntil = (e) => Math.round((examDate(e) - startOfToday()) / 86400000);

export const isValidDate = (day, month, year) => {
  const d = new Date(year, month, day);
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
};

export const formatDate = (e) => `${DAYS[(examDate(e).getDay() + 6) % 7].short}, ${e.day} ${MONTHS[e.month]} ${e.year}`;

export const countdownText = (n) => {
  if (n === 0) return 'today';
  if (n === 1) return 'tomorrow';
  if (n === -1) return 'yesterday';
  return n > 1 ? `in ${n} days` : `${-n} days ago`;
};

// Closer exams get a warmer color.
export const urgencyColor = (n) => (n <= 3 ? ACCENT.rose : n <= 7 ? ACCENT.amber : ACCENT.mint);

export function splitExams(exams) {
  const key = (e) => examDate(e).getTime() + toMinutes(e.time || '00:00') * 60000;
  return {
    upcoming: exams.filter((e) => daysUntil(e) >= 0).sort((a, b) => key(a) - key(b)),
    past: exams.filter((e) => daysUntil(e) < 0).sort((a, b) => key(b) - key(a)),
  };
}
