import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStyles } from '../theme/ThemeContext';
import Sheet from './Sheet';

export default function ConfirmModal({ visible, title, message, confirmLabel = 'Confirm', danger, onConfirm, onClose }) {
  const styles = useStyles(makeStyles);
  return (
    <Sheet visible={visible} onClose={onClose} scroll={false}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={[styles.confirm, danger && { backgroundColor: '#E8466B' }]} onPress={onConfirm}>
        <Text style={styles.confirmText}>{confirmLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancel} onPress={onClose}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    title: { fontSize: 20, fontWeight: '800', color: C.text },
    message: { fontSize: 14.5, color: C.muted, lineHeight: 21, marginTop: 8 },
    confirm: { backgroundColor: C.violet, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 22 },
    confirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    cancel: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
    cancelText: { color: C.muted, fontSize: 14, fontWeight: '700' },
  });
