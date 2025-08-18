import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { data } from "../test"; 

export async function seedPatient(patientId: string) {
    await setDoc(doc(db, "patients", patientId), {
        name: "Test Patient",
        settingsTree: data,
    });
    return data;
}
