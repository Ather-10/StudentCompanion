import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { DAYS, COLORS, isValidTime, toMinutes, format12, formatTimeInput } from '../utils/timetable';

export default function ClassModal({ visible, initial, defaultDay, onSave, onDelete, onClose }) {
  const { C } = useTheme();
  const styles = useStyles(makeStyles);
  const editing = !!initial;

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [days, setDays] = useState([0]);
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setError('');
    if (initial) {
      setName(initial.name);
      setRoom(initial.room);
      setStart(initial.start);
      setEnd(initial.end);
      setDays([initial.day]);
      setColor(initial.color);
    } else {
      setName('');
      setRoom('');
      setStart('09:00');
      setEnd('10:00');
      setDays([defaultDay]);
      setColor(COLORS[0]);
    }
  }, [visible, initial, defaultDay]);

  const toggleDay = (i) => {
    if (editing) return setDays([i]);
    setDays((d) => (d.includes(i) ? (d.length > 1 ? d.filter((x) => x !== i) : d) : [...d, i].sort()));
  };

  const save = () => {
    if (!name.trim()) return setError('Enter a course name.');
    if (!isValidTime(start) || !isValidTime(end)) return setError('Use 24-hour time, like 09:30 or 14:00.');
    if (toMinutes(end) <= toMinutes(start)) return setError('End time must be after the start time.');
    onSave({ name: name.trim(), room: room.trim(), start, end, color }, days);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{editing ? 'Edit class' : 'Add class'}</Text>

              <Text style={styles.label}>Course name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Calculus"
                placeholderTextColor={C.muted}
                value={name}
                autoCapitalize="words"
                onChangeText={setName}
              />

              <Text style={styles.label}>{editing ? 'Day' : 'Days'}</Text>
              <View style={styles.dayRow}>
                {DAYS.map((d, i) => {
                  const on = days.includes(i);
                  return (
                    <TouchableOpacity key={d.short} style={[styles.dayChip, on && styles.dayOn]} onPress={() => toggleDay(i)}>
                      <Text style={[styles.dayText, on && { color: '#fff' }]}>{d.short}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.timeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Starts{isValidTime(start) ? ` · ${format12(start)}` : ''}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="09:00"
                    placeholderTextColor={C.muted}
                    keyboardType="numeric"
                    maxLength={5}
                    value={start}
                    onChangeText={(t) => setStart(formatTimeInput(t))}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Ends{isValidTime(end) ? ` · ${format12(end)}` : ''}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10:00"
                    placeholderTextColor={C.muted}
                    keyboardType="numeric"
                    maxLength={5}
                    value={end}
                    onChangeText={(t) => setEnd(formatTimeInput(t))}
                  />
                </View>
              </View>

              <Text style={styles.label}>Room or location (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Room 12"
                placeholderTextColor={C.muted}
                value={room}
                onChangeText={setRoom}
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
                <Text style={styles.saveText}>{editing ? 'Save changes' : 'Add class'}</Text>
              </TouchableOpacity>

              {editing ? (
                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                  <Text style={styles.deleteText}>Delete class</Text>
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
    dayRow: { flexDirection: 'row', gap: 6 },
    dayChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: C.paper, alignItems: 'center' },
    dayOn: { backgroundColor: C.violet },
    dayText: { fontSize: 12, fontWeight: '700', color: C.muted },
    timeRow: { flexDirection: 'row', gap: 12 },
    colorRow: { flexDirection: 'row', gap: 12 },
    swatch: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    error: { color: C.rose, fontSize: 13, fontWeight: '600', marginTop: 14 },
    saveBtn: { backgroundColor: C.violet, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
    saveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    deleteBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
    deleteText: { color: C.rose, fontSize: 14, fontWeight: '700' },
  });
