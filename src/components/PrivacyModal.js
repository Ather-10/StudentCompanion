import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStyles } from '../theme/ThemeContext';
import { APP } from '../config/app';
import Sheet from './Sheet';

const SECTIONS = [
  ['Your data stays on your phone', 'Your classes, exams, name, university, profile photo and settings are stored only on your device. There is no account and no server.'],
  ['What we collect', 'Nothing. The app does not collect, sell or share your personal information, and it does not use analytics.'],
  ['Notifications', 'Class, exam and timer alarms are scheduled on your phone. You can switch each one off in Settings at any time.'],
  ['Deleting your data', 'Go to Settings and choose "Delete all my data", or uninstall the app. Both remove everything the app has saved.'],
  ['Changes', 'If we add features such as ads or cloud backup, we will update this policy and the app before they go live.'],
];

export default function PrivacyModal({ visible, onClose }) {
  const styles = useStyles(makeStyles);
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Privacy policy</Text>
      <Text style={styles.date}>{APP.name} · Last updated {APP.policyDate}</Text>
      {SECTIONS.map(([h, t]) => (
        <React.Fragment key={h}>
          <Text style={styles.h}>{h}</Text>
          <Text style={styles.p}>{t}</Text>
        </React.Fragment>
      ))}
      <Text style={styles.h}>Contact</Text>
      <Text style={styles.p}>Questions? Email {APP.supportEmail}.</Text>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    title: { fontSize: 20, fontWeight: '800', color: C.text },
    date: { fontSize: 12.5, color: C.muted, marginTop: 4 },
    h: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 18 },
    p: { fontSize: 14, color: C.muted, lineHeight: 21, marginTop: 4 },
    closeBtn: { backgroundColor: C.violet, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
    closeText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
