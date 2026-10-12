import React from 'react';
import { Image, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import { useSettings } from '../context/SettingsContext';

// Shows the profile photo, or the initials, or a person icon.
// `photo` and `name` are optional overrides (the profile editor uses them to preview changes).
export default function Avatar({ size = 42, photo, name }) {
  const { C } = useTheme();
  const { settings } = useSettings();
  const pic = photo !== undefined ? photo : settings.photo;
  const label = name !== undefined ? name : settings.name;

  const initials = label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  if (pic) {
    return <Image source={{ uri: pic }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.line }} />;
  }

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center' }}>
      {initials ? (
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: size * 0.38 }}>{initials}</Text>
      ) : (
        <Ionicons name="person" size={size * 0.48} color="#fff" />
      )}
    </View>
  );
}
