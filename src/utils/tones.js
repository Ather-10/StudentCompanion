// Built-in alarm tones. Each file is 15 seconds of ringing, repeated 3 times (about 50 seconds in total).
// The `file` name must match the sounds listed in app.json.
export const TONES = [
  { id: 'classic', label: 'Classic beep', file: 'alarm_classic.wav', asset: require('../../assets/sounds/alarm_classic.wav') },
  { id: 'digital', label: 'Digital', file: 'alarm_digital.wav', asset: require('../../assets/sounds/alarm_digital.wav') },
  { id: 'chime', label: 'Bell chime', file: 'alarm_chime.wav', asset: require('../../assets/sounds/alarm_chime.wav') },
  { id: 'rise', label: 'Rising', file: 'alarm_rise.wav', asset: require('../../assets/sounds/alarm_rise.wav') },
  { id: 'soft', label: 'Soft', file: 'alarm_soft.wav', asset: require('../../assets/sounds/alarm_soft.wav') },
];

export const DEFAULT_TONE = 'classic';

export const toneById = (id) => TONES.find((t) => t.id === id) || TONES[0];
