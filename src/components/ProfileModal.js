import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { pickProfilePhoto } from '../utils/photo';
import Avatar from './Avatar';
import Sheet from './Sheet';

export default function ProfileModal({ visible, name, school, photo, onSave, onClose }) {
  const { C } = useTheme();
  const styles = useStyles(makeStyles);
  const [n, setN] = useState('');
  const [s, setS] = useState('');
  const [pic, setPic] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setN(name);
      setS(school);
      setPic(photo || null);
      setError('');
    }
  }, [visible]);

  const choose = async (source) => {
    setError('');
    const r = await pickProfilePhoto(source);
    if (r.photo) setPic(r.photo);
    else if (r.error === 'camera-denied') setError('Camera permission is off. Allow it in your phone settings, or pick from the gallery.');
    else if (r.error) setError('Could not load that picture. Please try another one.');
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Your profile</Text>

      <View style={styles.photoWrap}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => choose('library')} accessibilityLabel="Change photo">
          <Avatar size={96} photo={pic} name={n} />
          <View style={styles.badge}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.photoBtns}>
          <TouchableOpacity style={styles.pill} onPress={() => choose('library')}>
            <Ionicons name="images-outline" size={16} color={C.violet} />
            <Text style={styles.pillText}>Gallery</Text>
          </TouchableOpacity>
          {Platform.OS !== 'web' ? (
            <TouchableOpacity style={styles.pill} onPress={() => choose('camera')}>
              <Ionicons name="camera-outline" size={16} color={C.violet} />
              <Text style={styles.pillText}>Camera</Text>
            </TouchableOpacity>
          ) : null}
          {pic ? (
            <TouchableOpacity style={styles.pill} onPress={() => setPic(null)}>
              <Ionicons name="trash-outline" size={16} color={C.rose} />
              <Text style={[styles.pillText, { color: C.rose }]}>Remove</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <Text style={styles.label}>Your name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Ali Khan"
        placeholderTextColor={C.muted}
        value={n}
        maxLength={30}
        autoCapitalize="words"
        onChangeText={setN}
      />

      <Text style={styles.label}>University or school (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. University of Agriculture"
        placeholderTextColor={C.muted}
        value={s}
        maxLength={60}
        autoCapitalize="words"
        onChangeText={setS}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={() => onSave({ name: n.trim(), school: s.trim(), photo: pic })}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    title: { fontSize: 20, fontWeight: '800', color: C.text },
    photoWrap: { alignItems: 'center', marginTop: 16, marginBottom: 4 },
    badge: {
      position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15,
      backgroundColor: C.violet, borderWidth: 3, borderColor: C.card, alignItems: 'center', justifyContent: 'center',
    },
    photoBtns: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 14 },
    pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.paper, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
    pillText: { fontSize: 13, fontWeight: '700', color: C.violet },
    error: { color: C.rose, fontSize: 13, fontWeight: '600', marginTop: 10, textAlign: 'center' },
    label: { fontSize: 13, fontWeight: '600', color: C.muted, marginTop: 14, marginBottom: 6 },
    input: { height: 46, borderRadius: 12, backgroundColor: C.paper, paddingHorizontal: 12, fontSize: 15, color: C.text, minWidth: 0 },
    saveBtn: { backgroundColor: C.violet, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 22 },
    saveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
