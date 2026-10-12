import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useCommon, getShadow } from '../theme/commonStyles';
import { useExams } from '../context/ExamsContext';
import ExamModal from '../components/ExamModal';
import { format12 } from '../utils/timetable';
import { splitExams, daysUntil, formatDate, urgencyColor } from '../utils/exams';

function ExamCard({ exam, past, onPress, styles, C }) {
  const n = daysUntil(exam);
  const tone = past ? C.muted : urgencyColor(n);
  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.card, past && { opacity: 0.6 }]} onPress={onPress}>
      <View style={[styles.tile, { backgroundColor: tone + '1F' }]}>
        {past ? (
          <Ionicons name="checkmark" size={26} color={tone} />
        ) : n === 0 ? (
          <Text style={[styles.tileToday, { color: tone }]}>Today</Text>
        ) : (
          <>
            <Text style={[styles.tileNum, { color: tone }]}>{n}</Text>
            <Text style={[styles.tileUnit, { color: tone }]}>{n === 1 ? 'day' : 'days'}</Text>
          </>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.subject}>{exam.subject}</Text>
        <Text style={styles.meta}>{formatDate(exam)}{exam.time ? ` · ${format12(exam.time)}` : ''}</Text>
        {exam.location ? <Text style={styles.meta}>{exam.location}</Text> : null}
      </View>
      <View style={[styles.stripe, { backgroundColor: exam.color }]} />
    </TouchableOpacity>
  );
}

export default function ExamsScreen() {
  const { C } = useTheme();
  const common = useCommon();
  const styles = useStyles(makeStyles);
  const { exams, addExam, updateExam, removeExam } = useExams();
  const [modal, setModal] = useState(null); // null | { item?: exam }

  const { upcoming, past } = splitExams(exams);

  const handleSave = (data) => {
    if (modal.item) updateExam(modal.item.id, data);
    else addExam(data);
    setModal(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={common.screen} contentContainerStyle={common.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={common.h1}>Exams</Text>
            <Text style={[common.hello, { marginTop: 4 }]}>
              {upcoming.length} upcoming{past.length ? ` · ${past.length} done` : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModal({})} accessibilityLabel="Add exam">
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {exams.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="hourglass-outline" size={30} color={C.violet} />
            </View>
            <Text style={styles.emptyTitle}>No exams yet</Text>
            <Text style={styles.emptyText}>Add an exam date and the countdown starts automatically.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModal({})}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.emptyBtnText}>Add exam</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {upcoming.map((e) => (
              <ExamCard key={e.id} exam={e} onPress={() => setModal({ item: e })} styles={styles} C={C} />
            ))}
            {past.length > 0 ? (
              <>
                <Text style={common.h2}>Past exams</Text>
                {past.map((e) => (
                  <ExamCard key={e.id} exam={e} past onPress={() => setModal({ item: e })} styles={styles} C={C} />
                ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>

      <ExamModal
        visible={!!modal}
        initial={modal ? modal.item : null}
        onClose={() => setModal(null)}
        onSave={handleSave}
        onDelete={() => {
          removeExam(modal.item.id);
          setModal(null);
        }}
      />
    </View>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    addBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center' },

    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 18, padding: 12, marginBottom: 12, overflow: 'hidden', ...getShadow(C) },
    tile: { width: 66, height: 66, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    tileNum: { fontSize: 24, fontWeight: '800', lineHeight: 28 },
    tileUnit: { fontSize: 12, fontWeight: '700' },
    tileToday: { fontSize: 14, fontWeight: '800' },
    subject: { fontSize: 16, fontWeight: '700', color: C.text },
    meta: { fontSize: 13, color: C.muted, marginTop: 2 },
    stripe: { width: 4, alignSelf: 'stretch', borderRadius: 2, marginLeft: 8 },

    empty: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 10 },
    emptyIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: C.violet + '1A', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: C.text },
    emptyText: { fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 6, lineHeight: 20, maxWidth: 260 },
    emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.violet, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, marginTop: 18 },
    emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  });
