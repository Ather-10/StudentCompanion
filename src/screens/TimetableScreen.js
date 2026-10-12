import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useCommon, getShadow } from '../theme/commonStyles';
import { useTimetable } from '../context/TimetableContext';
import ClassModal from '../components/ClassModal';
import { DAYS, todayIndex, classesForDay, format12 } from '../utils/timetable';

export default function TimetableScreen() {
  const { C } = useTheme();
  const common = useCommon();
  const styles = useStyles(makeStyles);
  const { classes, addClasses, updateClass, removeClass } = useTimetable();

  const today = todayIndex();
  const [day, setDay] = useState(today);
  const [modal, setModal] = useState(null); // null | { item?: class }

  const list = classesForDay(classes, day);

  const handleSave = (data, days) => {
    if (modal.item) {
      updateClass(modal.item.id, { ...data, day: days[0] });
      setDay(days[0]);
    } else {
      addClasses(days.map((d) => ({ ...data, day: d })));
      if (!days.includes(day)) setDay(days[0]);
    }
    setModal(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={common.screen} contentContainerStyle={common.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={common.h1}>Timetable</Text>
            <Text style={[common.hello, { marginTop: 4 }]}>
              {DAYS[day].long}{day === today ? ' (today)' : ''} · {list.length} {list.length === 1 ? 'class' : 'classes'}
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModal({})} accessibilityLabel="Add class">
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.dayStrip}>
          {DAYS.map((d, i) => {
            const selected = i === day;
            const hasClasses = classes.some((c) => c.day === i);
            return (
              <TouchableOpacity
                key={d.short}
                onPress={() => setDay(i)}
                style={[styles.dayBtn, selected && styles.dayBtnOn, !selected && i === today && styles.dayBtnToday]}
              >
                <Text style={[styles.dayText, selected && { color: '#fff' }]}>{d.short}</Text>
                <View style={[styles.dot, { opacity: hasClasses ? 1 : 0 }, selected && { backgroundColor: '#fff' }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {list.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={30} color={C.violet} />
            </View>
            <Text style={styles.emptyTitle}>No classes on {DAYS[day].long}</Text>
            <Text style={styles.emptyText}>Add a class and it will show up here and on your home screen.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModal({})}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.emptyBtnText}>Add class</Text>
            </TouchableOpacity>
          </View>
        ) : (
          list.map((c) => (
            <TouchableOpacity key={c.id} activeOpacity={0.85} style={styles.card} onPress={() => setModal({ item: c })}>
              <View style={styles.times}>
                <Text style={styles.timeStart}>{format12(c.start)}</Text>
                <Text style={styles.timeEnd}>{format12(c.end)}</Text>
              </View>
              <View style={[styles.bar, { backgroundColor: c.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.room}>{c.room || 'No room added'}</Text>
              </View>
              <Ionicons name="create-outline" size={18} color={C.muted} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ClassModal
        visible={!!modal}
        initial={modal ? modal.item : null}
        defaultDay={day}
        onClose={() => setModal(null)}
        onSave={handleSave}
        onDelete={() => {
          removeClass(modal.item.id);
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

    dayStrip: { flexDirection: 'row', gap: 6, marginBottom: 20 },
    dayBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: C.card, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
    dayBtnOn: { backgroundColor: C.violet },
    dayBtnToday: { borderColor: C.violet },
    dayText: { fontSize: 12, fontWeight: '700', color: C.muted },
    dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.violet, marginTop: 5 },

    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 18, padding: 14, marginBottom: 12, ...getShadow(C) },
    times: { width: 70 },
    timeStart: { fontSize: 13, fontWeight: '700', color: C.text },
    timeEnd: { fontSize: 12, color: C.muted, marginTop: 3 },
    bar: { width: 4, height: 38, borderRadius: 2, marginHorizontal: 12 },
    name: { fontSize: 16, fontWeight: '700', color: C.text },
    room: { fontSize: 13, color: C.muted, marginTop: 2 },

    empty: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 10 },
    emptyIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: C.violet + '1A', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: C.text },
    emptyText: { fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 6, lineHeight: 20, maxWidth: 260 },
    emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.violet, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, marginTop: 18 },
    emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  });
