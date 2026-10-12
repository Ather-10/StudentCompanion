import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import { getShadow } from '../theme/commonStyles';
import { navigationRef } from './navigationRef';

import AppHeader from '../components/AppHeader';
import MenuDrawer from '../components/MenuDrawer';
import PrivacyModal from '../components/PrivacyModal';
import HomeScreen from '../screens/HomeScreen';
import CGPAScreen from '../screens/CGPAScreen';
import TimetableScreen from '../screens/TimetableScreen';
import ExamsScreen from '../screens/ExamsScreen';
import FocusScreen from '../screens/FocusScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const ICONS = { Home: 'home', GPA: 'calculator', Timetable: 'calendar', Exams: 'hourglass', Focus: 'timer', Settings: 'settings' };
const HIDDEN = { tabBarItemStyle: { display: 'none' } }; // reachable from the menu, not shown in the bottom bar

function Navigator() {
  const { C, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [current, setCurrent] = useState('Home');

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = { ...base, colors: { ...base.colors, background: C.paper, card: C.card, border: C.line } };

  const go = (name) => {
    setMenuOpen(false);
    if (navigationRef.isReady()) navigationRef.navigate(name);
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navTheme}
      onStateChange={() => {
        const r = navigationRef.getCurrentRoute();
        if (r) setCurrent(r.name);
      }}
    >
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          header: () => <AppHeader onMenu={() => setMenuOpen(true)} onProfile={() => navigation.navigate('Settings')} />,
          tabBarActiveTintColor: C.violet,
          tabBarInactiveTintColor: C.tabInactive,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          // Keeps the bar above the phone's own back/home buttons
          tabBarStyle: {
            height: 58 + Math.max(insets.bottom, 8),
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 8),
            backgroundColor: C.card,
            borderTopWidth: isDark ? 1 : 0,
            borderTopColor: C.line,
            ...getShadow(C),
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? ICONS[route.name] : ICONS[route.name] + '-outline'} size={24} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Timetable" component={TimetableScreen} />
        <Tab.Screen name="Exams" component={ExamsScreen} />
        <Tab.Screen name="Focus" component={FocusScreen} />
        <Tab.Screen name="GPA" component={CGPAScreen} options={HIDDEN} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={HIDDEN} />
      </Tab.Navigator>

      <MenuDrawer
        visible={menuOpen}
        current={current}
        onClose={() => setMenuOpen(false)}
        onNavigate={go}
        onPrivacy={() => {
          setMenuOpen(false);
          setPrivacyOpen(true);
        }}
      />
      <PrivacyModal visible={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <Navigator />
    </SafeAreaProvider>
  );
}
