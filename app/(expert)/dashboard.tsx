import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Tree } from "../../components/Tree";
import { convertToTree } from "../logic/build_tree";

export default function ExpertDashboard() {
    const [patients, setPatients] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            const snap = await getDocs(collection(db, "patients"));
            const list: any[] = [];
            snap.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setPatients(list);
        };
        fetchPatients();
    }, []);

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>Patients</Text>
            {patients.map(patient => (
                <View key={patient.id} style={{ marginBottom: 24, borderBottomWidth: 1, borderColor: "#eee", paddingBottom: 12 }}>
                    <Pressable onPress={() => setExpanded(expanded === patient.id ? null : patient.id)}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "#339" }}>
                            {patient.name || "Unnamed"} (ID: {patient.id})
                        </Text>
                    </Pressable>
                    {expanded === patient.id && patient.settingsTree && (() => {
                        const { node, checked } = convertToTree(patient.settingsTree);
                        return (
                            <View style={{ marginTop: 12 }}>
                                <Text style={{ fontWeight: "500", marginBottom: 8 }}>Settings Tree:</Text>
                                <Tree root={node} checked={checked} onToggle={() => { }} />
                            </View>
                        );
                    })()}
                </View>
            ))}
            {patients.length === 0 && (
                <Text>No patients found.</Text>
            )}
        </ScrollView>
    );
}