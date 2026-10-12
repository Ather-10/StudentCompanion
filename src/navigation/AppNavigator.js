import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import { getShadow } from '../theme/commonStyles';

import HomeScreen from '../screens/HomeScreen';
import CGPAScreen from '../screens/CGPAScreen';
import TimetableScreen from '../screens/TimetableScreen';
import ExamsScreen from '../screens/ExamsScreen';
import FocusScreen from '../screens/FocusScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const ICONS = { Home: 'home', GPA: 'calculator', Timetable: 'calendar', Exams: 'hourglass', Focus: 'timer', Settings: 'settings' };

export default function AppNavigator() {
  const { C, isDark } = useTheme();
  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = { ...base, colors: { ...base.colors, background: C.paper, card: C.card, border: C.line } };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: C.violet,
          tabBarInactiveTintColor: C.tabInactive,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
          tabBarStyle: {
            height: 66, paddingTop: 8, backgroundColor: C.card,
            borderTopWidth: isDark ? 1 : 0, borderTopColor: C.line, ...getShadow(C),
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? ICONS[route.name] : ICONS[route.name] + '-outline'} size={22} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="GPA" component={CGPAScreen} options={{ tabBarLabel: 'CGPA' }} />
        <Tab.Screen name="Timetable" component={TimetableScreen} />
        <Tab.Screen name="Exams" component={ExamsScreen} />
        <Tab.Screen name="Focus" component={FocusScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      </Tab.Navigator>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}
