import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { COLORS, isValidTime, format12, formatTimeInput } from '../utils/timetable';
import { MONTHS, isValidDate, daysUntil, formatDate, countdownText } from '../utils/exams';

export default function ExamModal({ visible, initial, onSave, onDelete, onClose }) {
  const { C } = useTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const editing = !!initial;

  const [subject, setSubject] = useState('');
  const [dayStr, setDayStr] = useState('');
  const [month, setMonth] = useState(0);
  const [yearStr, setYearStr] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setError('');
    if (initial) {
      setSubject(initial.subject);
      setDayStr(String(initial.day));
      setMonth(initial.month);
      setYearStr(String(initial.year));
      setTime(initial.time);
      setLocation(initial.location);
      setColor(initial.color);
    } else {
      const n = new Date();
      setSubject('');
      setDayStr(String(n.getDate()));
      setMonth(n.getMonth());
      setYearStr(String(n.getFullYear()));
      setTime('');
      setLocation('');
      setColor(COLORS[0]);
    }
  }, [visible, initial]);

  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);
  const dateOk = year >= 2000 && year <= 2100 && isValidDate(day, month, year);
  const preview = dateOk ? `${formatDate({ day, month, year })} · ${countdownText(daysUntil({ day, month, year }))}` : '';

  const save = () => {
    if (!subject.trim()) return setError('Enter the subject name.');
    if (!dateOk) return setError('Enter a real date, like 24 Oct 2026.');
    if (time && !isValidTime(time)) return setError('Use 24-hour time, like 09:30, or leave it empty.');
    onSave({ subject: subject.trim(), day, month, year, time, location: location.trim(), color });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{editing ? 'Edit exam' : 'Add exam'}</Text>

            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics"
              placeholderTextColor={C.muted}
              value={subject}
              autoCapitalize="words"
              onChangeText={setSubject}
            />

            <View style={styles.twoCol}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Day</Text>
                <TextInput
                  style={styles.input}
                  placeholder="24"
                  placeholderTextColor={C.muted}
                  keyboardType="numeric"
                  maxLength={2}
                  value={dayStr}
                  onChangeText={(t) => setDayStr(t.replace(/\D/g, ''))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2026"
                  placeholderTextColor={C.muted}
                  keyboardType="numeric"
                  maxLength={4}
                  value={yearStr}
                  onChangeText={(t) => setYearStr(t.replace(/\D/g, ''))}
                />
              </View>
            </View>

            <Text style={styles.label}>Month</Text>
            <View style={styles.monthGrid}>
              {MONTHS.map((m, i) => (
                <TouchableOpacity key={m} style={[styles.monthChip, month === i && styles.monthOn]} onPress={() => setMonth(i)}>
                  <Text style={[styles.monthText, month === i && { color: '#fff' }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {preview ? <Text style={styles.preview}>{preview}</Text> : null}

            <Text style={styles.label}>Start time (optional){isValidTime(time) ? ` · ${format12(time)}` : ''}</Text>
            <TextInput
              style={styles.input}
              placeholder="09:00"
              placeholderTextColor={C.muted}
              keyboardType="numeric"
              maxLength={5}
              value={time}
              onChangeText={(t) => setTime(formatTimeInput(t))}
            />

            <Text style={styles.label}>Location (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Hall B"
              placeholderTextColor={C.muted}
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Color</Text>
            <View style={styles.colorRow}>
              {COLORS.map((c) => (
                <TouchableOpacity key={c} style={[styles.swatch, { backgroundColor: c }]} onPress={() => setColor(c)} accessibilityLabel="Pick color">
                  {color === c ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
                </TouchableOpacity>
              ))}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.saveBtn} onPress={save}>
              <Text style={styles.saveText}>{editing ? 'Save changes' : 'Add exam'}</Text>
            </TouchableOpacity>

            {editing ? (
              <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                <Text style={styles.deleteText}>Delete exam</Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
    title: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 6 },
    label: { fontSize: 13, fontWeight: '600', color: C.muted, marginTop: 14, marginBottom: 6 },
    input: { height: 46, borderRadius: 12, backgroundColor: C.paper, paddingHorizontal: 12, fontSize: 15, color: C.text, minWidth: 0 },
    twoCol: { flexDirection: 'row', gap: 12 },
    monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    monthChip: { width: '15.5%', paddingVertical: 10, borderRadius: 10, backgroundColor: C.paper, alignItems: 'center' },
    monthOn: { backgroundColor: C.violet },
    monthText: { fontSize: 12.5, fontWeight: '700', color: C.muted },
    preview: { fontSize: 13, fontWeight: '600', color: C.violet, marginTop: 10 },
    colorRow: { flexDirection: 'row', gap: 12 },
    swatch: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    error: { color: C.rose, fontSize: 13, fontWeight: '600', marginTop: 14 },
    saveBtn: { backgroundColor: C.violet, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
    saveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    deleteBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
    deleteText: { color: C.rose, fontSize: 14, fontWeight: '700' },
  });
