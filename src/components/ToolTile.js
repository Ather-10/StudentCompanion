import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useStyles } from '../theme/ThemeContext';
import { getShadow } from '../theme/commonStyles';

export default function ToolTile({ item, onPress }) {
  const styles = useStyles(makeStyles);
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.tile} onPress={onPress}>
      <View style={[styles.icon, { backgroundColor: item.color + '1A' }]}>
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.sub}>{item.sub}</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    tile: { width: '48%', backgroundColor: C.card, borderRadius: 18, padding: 16, ...getShadow(C) },
    icon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    title: { fontSize: 15, fontWeight: '700', color: C.text },
    sub: { fontSize: 12.5, color: C.muted, marginTop: 2 },
  });
