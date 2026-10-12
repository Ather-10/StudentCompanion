import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { getShadow } from '../theme/commonStyles';
import { TONES } from '../utils/tones';
import { previewTone, stopPreview } from '../utils/tonePreview';

// Pick the alarm sound. Tapping a tone selects it and plays a short preview.
export default function TonePicker({ value, onChange }) {
  const { C } = useTheme();
  const styles = useStyles(makeStyles);

  useEffect(() => stopPreview, []);

  return (
    <View style={styles.card}>
      {TONES.map((t, i) => {
        const on = t.id === value;
        return (
          <View key={t.id} style={[styles.row, i < TONES.length - 1 && styles.border]}>
            <TouchableOpacity
              style={styles.main}
              activeOpacity={0.7}
              onPress={() => {
                onChange(t.id);
                previewTone(t);
              }}
            >
              <View style={[styles.radio, on && { borderColor: C.violet }]}>{on ? <View style={[styles.dot, { backgroundColor: C.violet }]} /> : null}</View>
              <Text style={[styles.label, on && { color: C.violet }]}>{t.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.play} onPress={() => previewTone(t)} accessibilityLabel={`Preview ${t.label}`}>
              <Ionicons name="play" size={16} color={C.violet} />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    card: { backgroundColor: C.card, borderRadius: 18, paddingHorizontal: 16, ...getShadow(C) },
    row: { flexDirection: 'row', alignItems: 'center' },
    border: { borderBottomWidth: 1, borderBottomColor: C.line },
    main: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.line, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    label: { fontSize: 15, fontWeight: '600', color: C.text },
    play: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.violet + '1A', alignItems: 'center', justifyContent: 'center' },
  });
