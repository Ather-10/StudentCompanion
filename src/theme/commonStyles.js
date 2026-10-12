import { StyleSheet, Platform } from 'react-native';
import { useStyles } from './ThemeContext';

export const getShadow = (C) =>
  C.isDark
    ? {}
    : Platform.select({ web: { boxShadow: '0 6px 20px rgba(22,19,46,0.06)' }, default: { elevation: 2 } });

// Styles shared by several screens (page layout, headings, hero card, list card).
const makeCommon = (C) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.paper },
    content: { padding: 20, paddingTop: 12, paddingBottom: 32 },
    center: { alignItems: 'center', justifyContent: 'center', padding: 32 },

    hello: { fontSize: 14, color: C.muted, marginBottom: 2 },
    h1: { fontSize: 28, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
    h2: { fontSize: 18, fontWeight: '700', color: C.text, marginTop: 28, marginBottom: 12 },
    avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center' },

    hero: { backgroundColor: C.hero, borderRadius: 24, padding: 22 },
    heroLabel: { color: '#B9B5DD', fontSize: 14, fontWeight: '600' },
    heroRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
    heroNumber: { color: '#fff', fontSize: 64, fontWeight: '800', letterSpacing: -2 },
    heroUnit: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 10 },
    heroSub: { color: '#B9B5DD', fontSize: 14, marginTop: 2 },

    listCard: { backgroundColor: C.card, borderRadius: 18, paddingHorizontal: 16, ...getShadow(C) },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: C.line },
    rowTitle: { fontSize: 15, fontWeight: '700', color: C.text },
    rowSub: { fontSize: 12.5, color: C.muted, marginTop: 2 },
  });

export const useCommon = () => useStyles(makeCommon);
