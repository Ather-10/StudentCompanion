import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { getShadow } from '../theme/commonStyles';
import { useGreeting } from '../utils/greeting';
import Avatar from './Avatar';

// Top bar on every screen: photo + greeting on the left, menu button on the right.
export default function AppHeader({ onMenu, onProfile }) {
  const { C } = useTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const g = useGreeting();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity style={styles.left} onPress={onProfile} activeOpacity={0.8} accessibilityLabel="Open profile">
        <Avatar size={46} />
        <View style={styles.texts}>
          <Text style={styles.greet}>{g.text} {g.emoji}</Text>
          <Text style={styles.name} numberOfLines={1}>{settings.name || 'Student'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBtn} onPress={onMenu} activeOpacity={0.8} accessibilityLabel="Open menu">
        <Ionicons name="menu" size={26} color={C.text} />
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, backgroundColor: C.paper },
    left: { flex: 1, flexDirection: 'row', alignItems: 'center', minHeight: 48 },
    texts: { marginLeft: 12, flex: 1 },
    greet: { fontSize: 13, color: C.muted, fontWeight: '600' },
    name: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 1 },
    menuBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', marginLeft: 12, ...getShadow(C) },
  });
