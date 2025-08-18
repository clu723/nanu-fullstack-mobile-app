import React, { useEffect, useState } from "react";
import { AppState, Text, ScrollView } from "react-native";
import { CheckboxesMap, convertToTree, buildParentMap, TreeNode } from "../logic/build_tree";
import { Tree } from "../../components/Tree";
import { toggleNode } from "../logic/toggle";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { seedPatient } from "../seed";
import { useSettings } from "../context/SettingsSaveContext";

const fetchPatientSettings = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not logged in");
  }

  const patient = doc(db, "patients", user.uid);
  const snapshot = await getDoc(patient);

  if (snapshot.exists()) {
    const data = snapshot.data();
    return data.settingsTree;
  } else {
    return seedPatient(user.uid) // Seed with test.js if no data exists
  }
};

export default function SettingsScreen() {
  const { root, setRoot, checked, setChecked } = useSettings();
  const [maps, setMaps] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await fetchPatientSettings();
        const { node, checked } = convertToTree(settings);
        setRoot(node);
        setChecked(checked);
        setMaps(buildParentMap(node));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [setRoot, setChecked]);

  // If root or maps are not yet loaded, show loading state
  if (!root || !maps) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", padding: 16 }}>Patient Settings</Text>
      <Tree
        root={root}
        checked={checked}
        onToggle={(node, next) => {
          const nextChecked = toggleNode(
            node,
            next,
            maps.parent,
            maps.byId,
            checked
          );
          setChecked(nextChecked);
        }}
      />
    </ScrollView>
  );
}
