import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, useWindowDimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { APP } from '../config/app';
import { rateApp, shareApp, sendFeedback } from '../utils/links';
import Avatar from './Avatar';

const PAGES = [
  { name: 'Home', label: 'Home', icon: 'home' },
  { name: 'GPA', label: 'CGPA calculator', icon: 'calculator' },
  { name: 'Timetable', label: 'Timetable', icon: 'calendar' },
  { name: 'Exams', label: 'Exams', icon: 'hourglass' },
  { name: 'Focus', label: 'Focus timer', icon: 'timer' },
  { name: 'Settings', label: 'Settings', icon: 'settings' },
];

function Item({ icon, label, active, onPress, right, styles, C }) {
  return (
    <TouchableOpacity style={[styles.item, active && { backgroundColor: C.violet + '1A' }]} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.chip, active && { backgroundColor: C.violet }]}>
        <Ionicons name={icon} size={18} color={active ? '#fff' : C.violet} />
      </View>
      <Text style={[styles.itemText, active && { color: C.violet }]}>{label}</Text>
      {right || null}
    </TouchableOpacity>
  );
}

// Side menu that slides in from the right and covers most of the screen.
export default function MenuDrawer({ visible, current, onClose, onNavigate, onPrivacy }) {
  const { C, isDark, setMode } = useTheme();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { width } = useWindowDimensions();
  const drawerW = Math.min(340, Math.round(width * 0.82));

  const slide = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  const native = Platform.OS !== 'web';

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(slide, { toValue: 1, duration: 220, useNativeDriver: native }).start();
    } else {
      Animated.timing(slide, { toValue: 0, duration: 180, useNativeDriver: native }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={{ flex: 1 }}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: slide.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }]}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} accessibilityLabel="Close menu" />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            {
              width: drawerW,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
              transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [drawerW, 0] }) }],
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.topRow}>
              <Text style={styles.title}>Menu</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close menu">
                <Ionicons name="close" size={22} color={C.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.profile} activeOpacity={0.85} onPress={() => onNavigate('Settings')}>
              <Avatar size={52} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name} numberOfLines={1}>{settings.name || 'Add your name'}</Text>
                <Text style={styles.school} numberOfLines={1}>{settings.school || 'Tap to edit profile'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.muted} />
            </TouchableOpacity>

            <Text style={styles.section}>Go to</Text>
            {PAGES.map((p) => (
              <Item key={p.name} icon={p.icon} label={p.label} active={current === p.name} onPress={() => onNavigate(p.name)} styles={styles} C={C} />
            ))}

            <Text style={styles.section}>More</Text>
            <Item
              icon={isDark ? 'moon' : 'sunny'}
              label="Dark mode"
              onPress={() => setMode(isDark ? 'light' : 'dark')}
              styles={styles}
              C={C}
              right={<Switch value={isDark} onValueChange={(v) => setMode(v ? 'dark' : 'light')} trackColor={{ true: C.violet, false: C.line }} />}
            />
            <Item icon="share-social" label="Share the app" onPress={shareApp} styles={styles} C={C} />
            <Item icon="star" label="Rate the app" onPress={rateApp} styles={styles} C={C} />
            <Item icon="mail" label="Send feedback" onPress={sendFeedback} styles={styles} C={C} />
            <Item icon="shield-checkmark" label="Privacy policy" onPress={onPrivacy} styles={styles} C={C} />

            <Text style={styles.version}>{APP.name} · v{APP.version}</Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    drawer: {
      position: 'absolute', right: 0, top: 0, bottom: 0, backgroundColor: C.card,
      borderTopLeftRadius: 28, borderBottomLeftRadius: 28, paddingHorizontal: 16,
    },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    title: { fontSize: 22, fontWeight: '800', color: C.text },
    closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
    profile: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.paper, borderRadius: 18, padding: 12 },
    name: { fontSize: 16, fontWeight: '700', color: C.text },
    school: { fontSize: 12.5, color: C.muted, marginTop: 2 },
    section: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 22, marginBottom: 6, marginLeft: 6 },
    item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 14, minHeight: 52 },
    chip: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.violet + '1A', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    itemText: { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
    version: { fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 24 },
  });
