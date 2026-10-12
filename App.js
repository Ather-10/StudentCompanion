import React from 'react';
import { ThemeProvider } from './src/theme/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { TimetableProvider } from './src/context/TimetableContext';
import { ExamsProvider } from './src/context/ExamsContext';
import { FocusProvider } from './src/context/FocusContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <TimetableProvider>
          <ExamsProvider>
            <FocusProvider>
              <AppNavigator />
            </FocusProvider>
          </ExamsProvider>
        </TimetableProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
