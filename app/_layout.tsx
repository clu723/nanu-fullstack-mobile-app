import { Stack } from 'expo-router';
import { SettingsProvider } from './context/SettingsSaveContext';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Stack />
      </SettingsProvider>
    </AuthProvider>
  );
}
