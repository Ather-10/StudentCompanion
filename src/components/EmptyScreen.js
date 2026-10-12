import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useStyles } from '../theme/ThemeContext';
import { useCommon } from '../theme/commonStyles';

export default function EmptyScreen({ icon, title, text }) {
  const { C } = useTheme();
  const common = useCommon();
  const styles = useStyles(makeStyles);
  return (
    <View style={[common.screen, common.center]}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={34} color={C.violet} />
      </View>
      <Text style={common.h1}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const makeStyles = (C) =>
  StyleSheet.create({
    icon: { width: 72, height: 72, borderRadius: 24, backgroundColor: C.violet + '1A', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
    text: { fontSize: 15, color: C.muted, textAlign: 'center', marginTop: 8, maxWidth: 280, lineHeight: 22 },
  });
