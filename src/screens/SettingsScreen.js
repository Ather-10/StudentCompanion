import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Platform, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useTimetable } from '../context/TimetableContext';
import { useExams } from '../context/ExamsContext';
import { useCommon, getShadow } from '../theme/commonStyles';
import SettingRow from '../components/SettingRow';
import Segment from '../components/Segment';
import Avatar from '../components/Avatar';
import ProfileModal from '../components/ProfileModal';
import PrivacyModal from '../components/PrivacyModal';
import ConfirmModal from '../components/ConfirmModal';
import { setupNotifications, sendTestAlarm, RING_COUNT } from '../utils/notifications';
import { APP } from '../config/app';
import { rateApp, shareApp, sendFeedback } from '../utils/links';
import TonePicker from '../components/TonePicker';

export default function SettingsScreen({ navigation }) {
  const { C, mode, setMode } = useTheme();
  const { settings, update, reset } = useSettings();
  const { clearClasses } = useTimetable();
  const { clearExams } = useExams();
  const common = useCommon();
  const styles = useStyles(makeStyles);

  const [profileOpen, setProfileOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [testMsg, setTestMsg] = useState('');

  const switchColors = { true: C.violet, false: C.line };

  // Turning an alarm on also asks the phone for notification permission.
  const toggle = async (key, on) => {
    update({ [key]: on });
    if (on) await setupNotifications(settings.alarmTone);
  };

  const runTest = async () => {
    const r = await sendTestAlarm(settings.alarmTone);
    setTestMsg(
      r === 'sent' ? `Test alarm will ring ${RING_COUNT} times, starting in 3 seconds. Tap it to stop.`
      : r === 'web' ? 'Browser test: you should hear a beep. On your phone it shows a notification.'
      : 'Notifications are blocked. Turn them on in your phone: Settings > Apps > ' + APP.name + ' > Notifications.'
    );
  };

  const deleteAll = () => {
    clearClasses();
    clearExams();
    reset();
    setMode('system');
    setConfirmOpen(false);
  };

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="chevron-back" size={22} color={C.text} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={[common.h1, { marginBottom: 20 }]}>Settings</Text>

      {/* Profile */}
      <TouchableOpacity activeOpacity={0.85} style={styles.profile} onPress={() => setProfileOpen(true)}>
        <Avatar size={56} />
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={styles.profileName}>{settings.name || 'Add your name'}</Text>
          <Text style={common.rowSub}>{settings.school || 'Add your university'}</Text>
        </View>
        <Ionicons name="create-outline" size={20} color={C.muted} />
      </TouchableOpacity>

      {/* Appearance */}
      <Text style={common.h2}>Appearance</Text>
      <View style={common.listCard}>
        <View style={styles.padRow}>
          <Segment
            full
            value={mode}
            onChange={setMode}
            options={[
              { value: 'system', label: 'System' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </View>
      </View>

      {/* Study */}
      <Text style={common.h2}>Study</Text>
      <View style={common.listCard}>
        <SettingRow
          icon="school"
          label="GPA scale"
          last
          right={<Segment value={settings.scale} onChange={(v) => update({ scale: v })} options={[{ value: '4.0', label: '4.0' }, { value: '%', label: '%' }]} />}
        />
      </View>

      {/* Alarm sound */}
      <Text style={common.h2}>Alarm sound</Text>
      <TonePicker
        value={settings.alarmTone}
        onChange={(id) => {
          update({ alarmTone: id });
          setupNotifications(id);
        }}
      />
      <Text style={styles.hint}>Each alarm rings {RING_COUNT} times. Tap the notification to stop the rest.</Text>

      {/* Alarms */}
      <Text style={common.h2}>Alarms & reminders</Text>
      <View style={common.listCard}>
        <SettingRow
          icon="calendar"
          label="Class reminders"
          right={<Switch value={settings.classReminders} onValueChange={(v) => toggle('classReminders', v)} trackColor={switchColors} />}
        />
        {settings.classReminders ? (
          <View style={[styles.subRow, common.rowBorder]}>
            <Text style={styles.subLabel}>Minutes before class starts</Text>
            <View style={{ flexDirection: 'row' }}>
              <Segment
                full
                value={settings.leadMin}
                onChange={(v) => update({ leadMin: v })}
                options={[
                  { value: 0, label: 'Start' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                  { value: 15, label: '15' },
                  { value: 30, label: '30' },
                ]}
              />
            </View>
          </View>
        ) : null}

        <SettingRow
          icon="hourglass"
          label="Exam reminders"
          right={<Switch value={settings.examReminders} onValueChange={(v) => toggle('examReminders', v)} trackColor={switchColors} />}
        />
        {settings.examReminders ? (
          <View style={[styles.subRow, common.rowBorder]}>
            <Text style={styles.subLabel}>Remind me</Text>
            <View style={{ flexDirection: 'row' }}>
              <Segment
                full
                value={settings.examWhen}
                onChange={(v) => update({ examWhen: v })}
                options={[
                  { value: 'before', label: 'Day before' },
                  { value: 'day', label: 'Exam day' },
                  { value: 'both', label: 'Both' },
                ]}
              />
            </View>
          </View>
        ) : null}

        <SettingRow
          icon="timer"
          label="Focus timer alarm"
          right={<Switch value={settings.focusAlarm} onValueChange={(v) => toggle('focusAlarm', v)} trackColor={switchColors} />}
        />
        <SettingRow icon="alarm" label="Send a test alarm" onPress={runTest} last />
      </View>
      {testMsg ? <Text style={styles.hint}>{testMsg}</Text> : null}

      {Platform.OS !== 'web' ? (
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Alarm not ringing when the phone is locked?</Text>
          <Text style={styles.helpText}>1. Allow this app to start and run in the background (Phone Manager, Auto-start, or Battery settings).</Text>
          <Text style={styles.helpText}>2. Turn off battery optimization for this app.</Text>
          <Text style={styles.helpText}>3. Do not swipe the app away from recent apps. Lock it there if your phone allows.</Text>
          <Text style={styles.helpText}>4. Allow notifications on the lock screen, and turn the volume up.</Text>
          <TouchableOpacity style={styles.helpBtn} onPress={() => Linking.openSettings().catch(() => {})}>
            <Text style={styles.helpBtnText}>Open app settings</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Support */}
      <Text style={common.h2}>Support</Text>
      <View style={common.listCard}>
        <SettingRow icon="share-social" label="Share the app" onPress={shareApp} />
        <SettingRow icon="star" label="Rate the app" onPress={rateApp} />
        <SettingRow icon="mail" label="Send feedback" onPress={sendFeedback} last />
      </View>

      {/* About */}
      <Text style={common.h2}>About</Text>
      <View style={common.listCard}>
        <SettingRow icon="shield-checkmark" label="Privacy policy" onPress={() => setPrivacyOpen(true)} />
        <SettingRow icon="information-circle" label="Version" value={APP.version} last />
      </View>

      {/* Data */}
      <Text style={common.h2}>Data</Text>
      <View style={common.listCard}>
        <SettingRow icon="trash" label="Delete all my data" danger onPress={() => setConfirmOpen(true)} last />
      </View>
      <Text style={styles.hint}>Your classes, exams, profile and settings are saved on this phone only.</Text>

      <ProfileModal
        visible={profileOpen}
        name={settings.name}
        school={settings.school}
        photo={settings.photo}
        onClose={() => setProfileOpen(false)}
        onSave={(p) => {
          update(p);
          setProfileOpen(false);
        }}
      />
      <PrivacyModal visible={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <ConfirmModal
        visible={confirmOpen}
        danger
        title="Delete all data?"
        message="This removes your classes, exams, name and settings from this phone. It cannot be undone."
        confirmLabel="Delete everything"
        onConfirm={deleteAll}
        onClose={() => setConfirmOpen(false)}
      />
    </ScrollView>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    back: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginLeft: -4 },
    backText: { fontSize: 15, fontWeight: '600', color: C.text },
    profile: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 18, padding: 16, ...getShadow(C) },
    profileName: { fontSize: 17, fontWeight: '700', color: C.text },
    padRow: { flexDirection: 'row', paddingVertical: 14 },
    subRow: { paddingBottom: 14 },
    subLabel: { fontSize: 13, fontWeight: '600', color: C.muted, marginBottom: 8 },
    helpCard: { backgroundColor: C.card, borderRadius: 18, padding: 16, marginTop: 12, ...getShadow(C) },
    helpTitle: { fontSize: 14.5, fontWeight: '700', color: C.text, marginBottom: 8 },
    helpText: { fontSize: 13, color: C.muted, lineHeight: 19, marginTop: 4 },
    helpBtn: { alignSelf: 'flex-start', backgroundColor: C.violet + '1A', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, marginTop: 12 },
    helpBtnText: { color: C.violet, fontWeight: '700', fontSize: 13 },
    hint: { fontSize: 12.5, color: C.muted, marginTop: 8, marginLeft: 4, lineHeight: 18 },
  });
