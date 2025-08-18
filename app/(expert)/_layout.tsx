import React from "react";
import { Tabs } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ExpertTabs() {
  const { logout } = useAuth();

  return (
    <Tabs screenOptions={{
      headerRight: () => (
        <Pressable onPress={logout} style={{ marginRight: 12 }}>
          <Text>Logout</Text>
        </Pressable>
      )
    }}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
    </Tabs>
  );
}
