import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CheckboxesMap, TreeNode } from "../logic/build_tree";

const SettingsContext = createContext<any>(null);

export function useSettings() {
  return useContext(SettingsContext);
}

async function saveSettings(updatedSettings: any) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = doc(db, "patients", user.uid);
  await updateDoc(ref, {
    settingsTree: updatedSettings
  });
}

// Converts CheckboxesMap to JSON when storing into db
function buildJsonFromTree(node: TreeNode, checked: CheckboxesMap): any {
  if (!node.children || Object.keys(node.children).length === 0) {
    return !!checked[node.id];
  }

  const result: Record<string, any> = {};
  node.children.forEach(child => {
    result[child.label] = buildJsonFromTree(child, checked);
  });
  return result;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [root, setRoot] = useState<any | null>(null);
  const [checked, setChecked] = useState<any>({});

  const saveTreeToDb = async () => {
    if (root && checked) {
      const json = buildJsonFromTree(root, checked);
      await saveSettings(json);
    }
  };

  // Save settings when app goes to background or inactive state
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        saveTreeToDb();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [root, checked]);

  return (
    <SettingsContext.Provider value={{ root, setRoot, checked, setChecked, saveTreeToDb }}>
      {children}
    </SettingsContext.Provider>
  );
}