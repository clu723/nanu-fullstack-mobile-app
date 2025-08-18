import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import dayjs from "dayjs";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

function getMonthDays(year: number, month: number) {
    const days = [];
    const start = dayjs(`${year}-${month + 1}-01`);
    const end = start.endOf("month");
    for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, "day")) {
        days.push(d);
    }
    return days;
}

export default function CalendarScreen() {
    const today = dayjs();
    const [selected, setSelected] = useState(today.format("YYYY-MM-DD"));
    const [logs, setLogs] = useState<Record<string, string>>({});
    const [note, setNote] = useState("");

    const year = today.year();
    const month = today.month();
    const days = getMonthDays(year, month);

    useEffect(() => {
        setNote(logs[selected] || "");
    }, [selected, logs]);

    useEffect(() => {
        const fetchLogs = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const ref = doc(db, "patients", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                setLogs(data.logs || {});
            }
        };
        fetchLogs();
    }, []);

    const saveNote = async () => {
        setLogs(prev => {
            const updated = { ...prev, [selected]: note };
            const user = auth.currentUser;
            if (user) {
                const ref = doc(db, "patients", user.uid);
                updateDoc(ref, { logs: updated });
            }
            Alert.alert(
                "Log Saved",
                "Your log for " + selected + " has been saved.",
                [
                    { text: "Ok", onPress: () => console.log("Ok Pressed") }
                ]
            );
            return updated;
        });
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Calendar</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
                {days.map(d => {
                    const dateStr = d.format("YYYY-MM-DD");
                    const isToday = dateStr === today.format("YYYY-MM-DD");
                    const isSelected = dateStr === selected;
                    return (
                        <Pressable
                            key={dateStr}
                            onPress={() => setSelected(dateStr)}
                            style={{
                                width: 40, height: 40, margin: 2, borderRadius: 8,
                                backgroundColor: isSelected ? "#aee" : isToday ? "#ffd700" : "#eee",
                                alignItems: "center", justifyContent: "center", borderWidth: isSelected ? 2 : 1,
                                borderColor: isSelected ? "#339" : "#ccc"
                            }}
                        >
                            <Text style={{ fontWeight: isToday ? "bold" : "normal" }}>
                                {d.date()}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            <Text style={{ marginBottom: 4 }}>
                Log for <Text style={{ fontWeight: "bold" }}>{selected}</Text>
                {selected === today.format("YYYY-MM-DD") && " (Today)"}
            </Text>
            <TextInput
                placeholder="Write a daily note..."
                value={note}
                onChangeText={setNote}
                style={{ borderWidth: 1, padding: 10, borderRadius: 8, minHeight: 80, marginBottom: 8 }}
                multiline
            />
            <Pressable
                onPress={saveNote}
                style={{
                    backgroundColor: "#339",
                    padding: 10,
                    borderRadius: 8,
                    alignItems: "center"
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Save Log</Text>
            </Pressable>
        </ScrollView>
    );
}