import React, { use } from "react";
import { Tabs } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsSaveContext";

export default function PatientTabs() {
  const { logout } = useAuth();
  const settings = useSettings();

  return (
    <Tabs screenOptions={{
      headerRight: () => (
        // When logging out, save the settings tree to the database
        <Pressable onPress={async () => { 
          await settings.saveTreeToDb(); 
          logout();
        }} style={{ marginRight: 12 }}>
          <Text>Logout</Text>
        </Pressable>
      )
    }}>
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
    </Tabs>
  );
}
