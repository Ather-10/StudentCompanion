import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useCommon } from '../theme/commonStyles';

export default function SettingRow({ icon, label, value, onPress, right, last, danger }) {
  const { C } = useTheme();
  const common = useCommon();
  const styles = useStyles(makeStyles);
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} style={[styles.row, !last && common.rowBorder]}>
      <View style={[styles.icon, danger && { backgroundColor: C.rose + '1A' }]}>
        <Ionicons name={icon} size={18} color={danger ? C.rose : C.violet} />
      </View>
      <Text style={[styles.label, danger && { color: C.rose }]}>{label}</Text>
      {right ? (
        right
      ) : (
        <>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          {onPress ? <Ionicons name="chevron-forward" size={18} color={C.tabInactive} /> : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    icon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.violet + '1A', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    label: { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
    value: { fontSize: 14, color: C.muted, marginRight: 4 },
  });
