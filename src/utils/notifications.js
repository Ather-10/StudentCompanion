import { Platform } from 'react-native';
import { DEFAULT_TONE, toneById } from './tones';

// Notifications only exist on the phone (Android/iOS). In the browser everything here quietly does nothing.
const isNative = Platform.OS !== 'web';
const N = isNative ? require('expo-notifications') : null;

if (N) {
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// One Android channel per tone (a channel's sound cannot be changed later).
const channelFor = (toneId) => 'alarm_v1_' + toneById(toneId).id;

// Vibrate 0.5s on / 0.5s off for 15s, three times with a 3s pause (matches the tone file).
const VIBRATION = (() => {
  const p = [0];
  for (let ring = 0; ring < 3; ring++) {
    for (let i = 0; i < 15; i++) p.push(500, i === 14 ? 3500 : 500);
  }
  return p;
})();

async function ensureChannel(toneId) {
  if (Platform.OS !== 'android') return;
  const tone = toneById(toneId);
  const base = {
    name: `Alarm - ${tone.label}`,
    importance: N.AndroidImportance.MAX,
    vibrationPattern: VIBRATION,
    enableVibrate: true,
    sound: tone.file,
  };
  try {
    await N.setNotificationChannelAsync(channelFor(toneId), {
      ...base,
      audioAttributes: { usage: N.AndroidAudioUsage.ALARM, contentType: N.AndroidAudioContentType.SONIFICATION },
    });
  } catch (e) {
    await N.setNotificationChannelAsync(channelFor(toneId), base);
  }
}

// Creates the alarm channel and asks for permission. Returns true if allowed.
export async function setupNotifications(toneId = DEFAULT_TONE) {
  if (!N) return false;
  try {
    await ensureChannel(toneId);
    const current = await N.getPermissionsAsync();
    if (current.status === 'granted') return true;
    if (current.canAskAgain === false) return false;
    return (await N.requestPermissionsAsync()).status === 'granted';
  } catch (e) {
    return false;
  }
}

async function cancelKind(kind) {
  if (!N) return;
  const all = await N.getAllScheduledNotificationsAsync();
  await Promise.all(
    all
      .filter((n) => n.content.data && n.content.data.kind === kind)
      .map((n) => N.cancelScheduledNotificationAsync(n.identifier))
  );
}

/* ---------- Focus timer alarm ---------- */
export const focusAlarmText = (mode) =>
  mode === 'focus'
    ? { title: 'Focus session complete 🎉', body: 'Great work! Time for a break.' }
    : { title: 'Break is over', body: 'Ready for the next focus session?' };

let focusToken = 0;

// Rings after `seconds`, even if the app is in the background or the phone is locked.
export async function scheduleFocusAlarm(seconds, mode, toneId = DEFAULT_TONE) {
  if (!N) return;
  const token = ++focusToken;
  const ok = await setupNotifications(toneId);
  if (!ok || token !== focusToken) return;
  await cancelKind('focus');
  const { title, body } = focusAlarmText(mode);
  await N.scheduleNotificationAsync({
    content: { title, body, sound: 'default', priority: 'max', data: { kind: 'focus' } },
    trigger: { type: N.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.max(1, Math.round(seconds)), repeats: false, channelId: channelFor(toneId) },
  });
}

export function cancelFocusAlarm() {
  focusToken++;
  return cancelKind('focus').catch(() => {});
}

// Browser only: a short beep so you can test the timer on your laptop.
export function playWebBeep() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.25);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch (e) {
    // sound is optional
  }
}

/* ---------- Class and exam reminders ---------- */
async function doSync({ classes = [], exams = [], settings }) {
  if (!N) return;
  await cancelKind('plan');
  const wantClasses = settings && settings.classReminders;
  const wantExams = settings && settings.examReminders;
  if (!wantClasses && !wantExams) return;
  if ((await N.getPermissionsAsync()).status !== 'granted') return;

  const T = N.SchedulableTriggerInputTypes;
  const channelId = channelFor(settings.alarmTone);
  await ensureChannel(settings.alarmTone);

  // Classes repeat every week at (start time - lead minutes)
  if (wantClasses) {
    const leadMin = settings.leadMin;
    for (const c of classes) {
      const [h, m] = c.start.split(':').map(Number);
      let total = h * 60 + m - leadMin;
      let day = c.day;
      if (total < 0) {
        total += 1440;
        day = (day + 6) % 7;
      }
      await N.scheduleNotificationAsync({
        content: {
          title: c.name,
          body: (leadMin ? `Class starts in ${leadMin} min` : 'Class is starting now') + (c.room ? ` · ${c.room}` : ''),
          sound: 'default',
          priority: 'max',
          data: { kind: 'plan' },
        },
        // Our days: 0 = Monday. Expo weekdays: 1 = Sunday ... 7 = Saturday.
        trigger: { type: T.WEEKLY, weekday: ((day + 1) % 7) + 1, hour: Math.floor(total / 60), minute: total % 60, channelId },
      });
    }
  }

  // Exams: the day before at 9 AM, and/or the morning of (1 hour before if a time is set)
  if (wantExams) {
    const when = settings.examWhen;
    const now = Date.now();
    for (const e of exams) {
      const dayBefore = new Date(e.year, e.month, e.day - 1, 9, 0);
      let dayOf = new Date(e.year, e.month, e.day, 7, 0);
      if (e.time) {
        const [h, m] = e.time.split(':').map(Number);
        dayOf = new Date(e.year, e.month, e.day, h, m - 60);
      }
      const items = [];
      if (when !== 'day') items.push({ date: dayBefore, title: `Exam tomorrow: ${e.subject}`, body: 'Revise and get a good sleep.' });
      if (when !== 'before') items.push({ date: dayOf, title: `Exam today: ${e.subject}`, body: e.time ? 'Starts in about 1 hour. Good luck!' : 'Good luck!' });
      for (const it of items) {
        if (it.date.getTime() <= now) continue;
        await N.scheduleNotificationAsync({
          content: { title: it.title, body: it.body, sound: 'default', priority: 'max', data: { kind: 'plan' } },
          trigger: { type: T.DATE, date: it.date, channelId },
        });
      }
    }
  }
}

// Rings in 3 seconds so you can check that alarms work on this phone.
// Returns 'sent' | 'denied' | 'web'
export async function sendTestAlarm(toneId = DEFAULT_TONE) {
  if (!N) {
    playWebBeep();
    return 'web';
  }
  const ok = await setupNotifications(toneId);
  if (!ok) return 'denied';
  await N.scheduleNotificationAsync({
    content: { title: 'Test alarm ✅', body: 'Your alarms are working. Swipe this away to stop.', sound: 'default', priority: 'max', data: { kind: 'test' } },
    trigger: { type: N.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3, repeats: false, channelId: channelFor(toneId) },
  });
  return 'sent';
}

// Runs one sync at a time so quick edits never create duplicates.
let chain = Promise.resolve();
export const syncPlanReminders = (args) => {
  chain = chain.then(() => doSync(args)).catch(() => {});
  return chain;
};
