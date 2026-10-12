import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useCommon, getShadow } from '../theme/commonStyles';
import { useFocus } from '../context/FocusContext';
import ProgressRing from '../components/ProgressRing';
import Segment from '../components/Segment';
import { MODES, LIMITS, formatClock, formatFocus } from '../utils/focus';

// One row to set the length of a mode: [-]  25 min  [+]
function LengthRow({ label, color, value, min, max, disabled, onChange, styles, C }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = (text) => {
    const n = Math.min(max, Math.max(min, parseInt(text, 10) || value));
    onChange(n);
    setDraft(String(n));
  };

  return (
    <View style={[styles.lenRow, disabled && { opacity: 0.5 }]} pointerEvents={disabled ? 'none' : 'auto'}>
      <View style={[styles.lenDot, { backgroundColor: color }]} />
      <Text style={styles.lenLabel}>{label}</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={() => commit(String(value - 1))} accessibilityLabel={`Decrease ${label}`}>
        <Ionicons name="remove" size={18} color={C.text} />
      </TouchableOpacity>
      <TextInput
        style={styles.lenInput}
        value={draft}
        keyboardType="numeric"
        maxLength={3}
        onChangeText={(t) => setDraft(t.replace(/\D/g, ''))}
        onBlur={() => commit(draft)}
        onSubmitEditing={() => commit(draft)}
        selectTextOnFocus
      />
      <Text style={styles.lenUnit}>min</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={() => commit(String(value + 1))} accessibilityLabel={`Increase ${label}`}>
        <Ionicons name="add" size={18} color={C.text} />
      </TouchableOpacity>
    </View>
  );
}

export default function FocusScreen() {
  const { C } = useTheme();
  const common = useCommon();
  const styles = useStyles(makeStyles);
  const { width } = useWindowDimensions();
  const f = useFocus();

  const ringSize = Math.min(260, width - 80);
  const modeColor = { focus: C.violet, short: C.mint, long: C.amber };
  const color = modeColor[f.mode];
  const progress = 1 - f.remaining / f.total;
  const filled = f.mode === 'long' ? 4 : f.sessions % 4;

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={common.h1}>Focus timer</Text>
      <Text style={[common.hello, { marginTop: 4, marginBottom: 20 }]}>
        {f.mode === 'focus' ? 'Stay on one task until the timer ends.' : 'Take a break. You earned it.'}
      </Text>

      <View style={{ flexDirection: 'row' }}>
        <Segment
          full
          value={f.mode}
          onChange={f.selectMode}
          options={Object.keys(MODES).map((k) => ({ value: k, label: MODES[k].label }))}
        />
      </View>

      <View style={styles.ringWrap}>
        <ProgressRing size={ringSize} progress={progress} color={color} track={C.line}>
          <Text style={[styles.clock, { fontSize: ringSize * 0.22 }]}>{formatClock(f.remaining)}</Text>
          <Text style={styles.modeLabel}>
            {f.mode === 'focus' ? `Session ${(f.sessions % 4) + 1} of 4` : MODES[f.mode].full}
          </Text>
        </ProgressRing>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideBtn} onPress={f.reset} accessibilityLabel="Reset timer">
          <Ionicons name="refresh" size={22} color={C.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainBtn, { backgroundColor: color }]}
          onPress={f.running ? f.pause : f.start}
          accessibilityLabel={f.running ? 'Pause timer' : 'Start timer'}
        >
          <Ionicons name={f.running ? 'pause' : 'play'} size={32} color="#fff" style={f.running ? null : { marginLeft: 4 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn} onPress={f.skip} accessibilityLabel="Skip to next">
          <Ionicons name="play-skip-forward" size={22} color={C.text} />
        </TouchableOpacity>
      </View>

      <Text style={common.h2}>Set your timer</Text>
      <View style={styles.lenCard}>
        {Object.keys(MODES).map((k, i) => (
          <LengthRow
            key={k}
            label={MODES[k].full}
            color={modeColor[k]}
            value={f.lengths[k]}
            min={LIMITS[k][0]}
            max={LIMITS[k][1]}
            disabled={f.running}
            onChange={(n) => f.setLength(k, n)}
            styles={styles}
            C={C}
          />
        ))}
      </View>
      {f.running ? <Text style={styles.hint}>Pause the timer to change the lengths.</Text> : null}

      <Text style={common.h2}>Today</Text>
      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{formatFocus(f.focusSec)}</Text>
          <Text style={styles.statLabel}>Focused</Text>
        </View>
        <View style={[styles.stat, styles.statDivider]}>
          <Text style={styles.statNum}>{f.sessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={[styles.stat, styles.statDivider]}>
          <View style={styles.dots}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, i < filled && { backgroundColor: C.violet }]} />
            ))}
          </View>
          <Text style={styles.statLabel}>Until long break</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    ringWrap: { alignItems: 'center', marginTop: 28, marginBottom: 28 },
    clock: { fontWeight: '800', color: C.text, letterSpacing: -1, fontVariant: ['tabular-nums'] },
    modeLabel: { fontSize: 14, fontWeight: '600', color: C.muted, marginTop: 4 },

    controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22 },
    mainBtn: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
    sideBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', ...getShadow(C) },

    lenCard: { backgroundColor: C.card, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 6, ...getShadow(C) },
    lenRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    lenDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    lenLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: C.text },
    stepBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
    lenInput: { width: 46, height: 34, textAlign: 'center', fontSize: 16, fontWeight: '800', color: C.text, padding: 0, minWidth: 0 },
    lenUnit: { fontSize: 12, color: C.muted, marginRight: 8 },
    hint: { fontSize: 12.5, color: C.muted, marginTop: 8, marginLeft: 4 },

    statsCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 12, ...getShadow(C) },
    stat: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    statDivider: { borderLeftWidth: 1, borderLeftColor: C.line },
    statNum: { fontSize: 20, fontWeight: '800', color: C.text },
    statLabel: { fontSize: 12, color: C.muted, marginTop: 4, textAlign: 'center' },
    dots: { flexDirection: 'row', gap: 5, height: 24, alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.line },
  });
