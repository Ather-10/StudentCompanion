import { useEffect, useState } from 'react';

export function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h >= 12 && h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (h >= 17 && h < 21) return { text: 'Good evening', emoji: '🌆' };
  return { text: 'Good night', emoji: '🌙' };
}

// Re-checks the time every minute so the greeting changes by itself.
export function useGreeting() {
  const [g, setG] = useState(getGreeting());
  useEffect(() => {
    const id = setInterval(() => setG(getGreeting()), 60000);
    return () => clearInterval(id);
  }, []);
  return g;
}
