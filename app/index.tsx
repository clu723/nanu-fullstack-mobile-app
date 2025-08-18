import React, { useState } from "react";
import { Text, View } from '@/components/Themed';
import { TextInput, Pressable } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Login</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        secureTextEntry
      />

      <Pressable
        onPress={() => login(email, password)}
        style={{ backgroundColor: "black", padding: 14, borderRadius: 10, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Continue</Text>
      </Pressable>
    </View>
  );
}