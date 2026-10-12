import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useCommon, getShadow } from '../theme/commonStyles';
import { GRADES, newCourse, newSemester, calc, fmt } from '../utils/cgpa';

const CREDIT_W = 46;
const GRADE_W = 62;

export default function CGPAScreen() {
  const { C } = useTheme();
  const { scale } = useSettings();
  const common = useCommon();
  const styles = useStyles(makeStyles);

  const [sems, setSems] = useState(() => [newSemester()]);
  const [picker, setPicker] = useState(null); // { sid, cid }

  const mapSem = (sid, fn) => setSems((all) => all.map((sm) => (sm.id === sid ? fn(sm) : sm)));
  const updateCourse = (sid, cid, patch) =>
    mapSem(sid, (sm) => ({ ...sm, courses: sm.courses.map((c) => (c.id === cid ? { ...c, ...patch } : c)) }));
  const addCourse = (sid) => mapSem(sid, (sm) => ({ ...sm, courses: [...sm.courses, newCourse()] }));
  const removeCourse = (sid, cid) => mapSem(sid, (sm) => ({ ...sm, courses: sm.courses.filter((c) => c.id !== cid) }));
  const removeSem = (sid) => setSems((all) => all.filter((sm) => sm.id !== sid));
  const addSem = () => setSems((all) => [...all, newSemester()]);

  const total = calc(sems.flatMap((s) => s.courses), scale);
  const counted = sems.filter((s) => calc(s.courses, scale).credits > 0).length;
  const is4 = scale === '4.0';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={common.screen} contentContainerStyle={common.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={common.h1}>CGPA calculator</Text>
        <Text style={[common.hello, { marginTop: 4, marginBottom: 18 }]}>Add your courses, credits and grades.</Text>

        <View style={common.hero}>
          <Text style={common.heroLabel}>{is4 ? 'Your CGPA' : 'Your average'}</Text>
          <View style={common.heroRow}>
            <Text style={common.heroNumber}>{fmt(total.value, scale)}</Text>
            {is4 && total.value !== null ? <Text style={common.heroUnit}>/ 4.0</Text> : null}
          </View>
          <Text style={common.heroSub}>
            {total.value === null
              ? 'Add a grade and credits to see your result'
              : `${counted} ${counted === 1 ? 'semester' : 'semesters'} · ${total.credits} credits`}
          </Text>
        </View>

        {sems.map((sem, i) => {
          const r = calc(sem.courses, scale);
          return (
            <View key={sem.id} style={styles.semCard}>
              <View style={styles.semHeader}>
                <Text style={styles.semTitle}>Semester {i + 1}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{is4 ? 'GPA ' : 'Avg '}{fmt(r.value, scale)}</Text>
                </View>
                {sems.length > 1 ? (
                  <TouchableOpacity onPress={() => removeSem(sem.id)} style={{ marginLeft: 8 }} accessibilityLabel="Delete semester">
                    <Ionicons name="trash-outline" size={19} color={C.muted} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.colHead}>
                <Text style={[styles.colText, { flex: 1 }]}>Course</Text>
                <Text style={[styles.colText, { width: CREDIT_W, textAlign: 'center' }]}>Credits</Text>
                <Text style={[styles.colText, { width: GRADE_W, textAlign: 'center' }]}>{is4 ? 'Grade' : 'Marks'}</Text>
                <View style={{ width: 22 }} />
              </View>

              {sem.courses.map((c) => (
                <View key={c.id} style={styles.courseRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, minWidth: 0 }]}
                    placeholder="Course name"
                    placeholderTextColor={C.muted}
                    value={c.name}
                    autoCapitalize="words"
                    onChangeText={(t) => updateCourse(sem.id, c.id, { name: t })}
                  />
                  <TextInput
                    style={[styles.input, { width: CREDIT_W, textAlign: 'center', paddingHorizontal: 0 }]}
                    placeholder="3"
                    placeholderTextColor={C.muted}
                    keyboardType="numeric"
                    value={c.credits}
                    onChangeText={(t) => updateCourse(sem.id, c.id, { credits: t.replace(/[^0-9.]/g, '') })}
                  />
                  {is4 ? (
                    <TouchableOpacity style={[styles.input, styles.gradeCell]} onPress={() => setPicker({ sid: sem.id, cid: c.id })}>
                      <Text style={{ color: c.grade ? C.text : C.muted, fontWeight: c.grade ? '700' : '400', fontSize: 14 }}>
                        {c.grade || 'Select'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      style={[styles.input, { width: GRADE_W, textAlign: 'center', paddingHorizontal: 0 }]}
                      placeholder="0–100"
                      placeholderTextColor={C.muted}
                      keyboardType="numeric"
                      value={c.marks}
                      onChangeText={(t) => updateCourse(sem.id, c.id, { marks: t.replace(/[^0-9.]/g, '') })}
                    />
                  )}
                  <TouchableOpacity onPress={() => removeCourse(sem.id, c.id)} style={{ width: 22, alignItems: 'flex-end' }} accessibilityLabel="Remove course">
                    <Ionicons name="close" size={18} color={C.muted} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addCourse} onPress={() => addCourse(sem.id)}>
                <Ionicons name="add" size={18} color={C.violet} />
                <Text style={styles.addText}>Add course</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity style={styles.addSem} onPress={addSem}>
          <Ionicons name="add-circle-outline" size={20} color={C.violet} />
          <Text style={styles.addText}>Add semester</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={!!picker} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <View style={styles.backdrop}>
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={() => setPicker(null)} accessibilityLabel="Close" />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select grade</Text>
            <View style={styles.gradeGrid}>
              {GRADES.map((x) => (
                <TouchableOpacity
                  key={x.g}
                  style={styles.gradeBtn}
                  onPress={() => {
                    updateCourse(picker.sid, picker.cid, { grade: x.g });
                    setPicker(null);
                  }}
                >
                  <Text style={styles.gradeLetter}>{x.g}</Text>
                  <Text style={styles.gradePts}>{x.p.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 16, padding: 6 }}
              onPress={() => {
                updateCourse(picker.sid, picker.cid, { grade: null });
                setPicker(null);
              }}
            >
              <Text style={{ color: C.muted, fontWeight: '600' }}>Clear grade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    semCard: { backgroundColor: C.card, borderRadius: 20, padding: 14, marginTop: 16, ...getShadow(C) },
    semHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    semTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: C.text },
    badge: { backgroundColor: C.violet + '1A', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
    badgeText: { fontSize: 12.5, fontWeight: '700', color: C.violet },
    colHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    colText: { fontSize: 12, fontWeight: '600', color: C.muted },
    courseRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    input: { height: 42, borderRadius: 10, backgroundColor: C.paper, paddingHorizontal: 10, fontSize: 14, color: C.text },
    gradeCell: { width: GRADE_W, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 },
    addCourse: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, paddingVertical: 8, paddingRight: 8 },
    addText: { fontSize: 14, fontWeight: '700', color: C.violet },
    addSem: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, paddingVertical: 15,
      borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.line,
    },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 28 },
    sheetTitle: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 14 },
    gradeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
    gradeBtn: { width: '23%', paddingVertical: 12, borderRadius: 14, backgroundColor: C.paper, alignItems: 'center' },
    gradeLetter: { fontSize: 17, fontWeight: '800', color: C.text },
    gradePts: { fontSize: 11.5, color: C.muted, marginTop: 2 },
  });
