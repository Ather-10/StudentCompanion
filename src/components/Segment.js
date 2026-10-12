import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useStyles } from '../theme/ThemeContext';

export default function Segment({ options, value, onChange, full }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.segment, full && { flex: 1 }]}>
      {options.map((o) => (
        <TouchableOpacity
          key={o.value}
          onPress={() => onChange(o.value)}
          style={[styles.btn, full && { flex: 1, alignItems: 'center', paddingHorizontal: 4 }, value === o.value && styles.active]}
        >
          <Text style={[styles.text, value === o.value && { color: '#fff' }]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    segment: { flexDirection: 'row', backgroundColor: C.paper, borderRadius: 10, padding: 3 },
    btn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 8 },
    active: { backgroundColor: C.violet },
    text: { fontSize: 13, fontWeight: '700', color: C.muted },
  });
