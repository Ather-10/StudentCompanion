import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useCommon, getShadow } from '../theme/commonStyles';
import ToolTile from '../components/ToolTile';
import { TOOLS } from '../data/sample';
import { useTimetable } from '../context/TimetableContext';
import { useExams } from '../context/ExamsContext';
import { useFocus } from '../context/FocusContext';
import { formatFocus } from '../utils/focus';
import { splitExams, daysUntil, MONTHS } from '../utils/exams';
import { DAYS, todayIndex, classesForDay, format12 } from '../utils/timetable';

export default function HomeScreen({ navigation }) {
  const { C } = useTheme();
  const common = useCommon();
  const styles = useStyles(makeStyles);
  const { classes } = useTimetable();
  const todays = classesForDay(classes, todayIndex());
  const { exams } = useExams();
  const { focusSec } = useFocus();
  const next = splitExams(exams).upcoming[0];
  const daysLeft = next ? daysUntil(next) : null;
  const now = new Date();
  const dateLine = `${DAYS[todayIndex()].long}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content} showsVerticalScrollIndicator={false}>
      <View style={common.hero}>
        <Text style={common.heroLabel}>{dateLine}</Text>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{todays.length}</Text>
            <Text style={styles.statLabel}>Classes today</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statNum} numberOfLines={1} adjustsFontSizeToFit>
              {daysLeft === null ? '–' : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
            </Text>
            <Text style={styles.statLabel}>Next exam</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statNum} numberOfLines={1} adjustsFontSizeToFit>{formatFocus(focusSec)}</Text>
            <Text style={styles.statLabel}>Focus today</Text>
          </View>
        </View>
      </View>

      <Text style={common.h2}>Tools</Text>
      <View style={styles.grid}>
        {TOOLS.map((t) => (
          <ToolTile key={t.key} item={t} onPress={() => navigation.navigate(t.key)} />
        ))}
      </View>

      <Text style={common.h2}>Today's classes</Text>
      {todays.length === 0 ? (
        <TouchableOpacity activeOpacity={0.85} style={styles.emptyCard} onPress={() => navigation.navigate('Timetable')}>
          <Ionicons name="calendar-outline" size={22} color={C.violet} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={common.rowTitle}>No classes today</Text>
            <Text style={common.rowSub}>Tap to add your timetable</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.tabInactive} />
        </TouchableOpacity>
      ) : (
        <View style={common.listCard}>
          {todays.map((c, i) => (
            <View key={c.id} style={[common.row, i < todays.length - 1 && common.rowBorder]}>
              <View style={[styles.bar, { backgroundColor: c.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={common.rowTitle}>{c.name}</Text>
                <Text style={common.rowSub}>{c.room || 'No room added'}</Text>
              </View>
              <Text style={styles.time}>{format12(c.start)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
    heroBtn: {
      flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8,
      backgroundColor: '#fff', paddingVertical: 11, paddingHorizontal: 18, borderRadius: 999, marginTop: 18,
    },
    heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 8 },
    statRow: { flexDirection: 'row', marginTop: 16 },
    stat: { flex: 1 },
    statDivider: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.15)', paddingLeft: 12 },
    statNum: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    statLabel: { color: '#B9B5DD', fontSize: 12, marginTop: 4 },
    heroBtnText: { color: '#16132E', fontWeight: '700', fontSize: 14 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
    bar: { width: 4, height: 34, borderRadius: 2, marginRight: 14 },
    emptyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 18, padding: 16, ...getShadow(C) },
    time: { fontSize: 14, fontWeight: '600', color: C.muted },
  });
