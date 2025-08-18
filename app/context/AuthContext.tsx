import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export type Role = "patient" | "expert" | null;

export type AuthCtx = {
  role: Role;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role as Role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return unsubscribe;
  }, []);

  const userProfile = useMemo<AuthCtx>(() => ({
    role,
    user,
    login: async (email, password) => {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);

      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
      if (!userDoc.exists()) throw new Error("User profile missing");
      const r = userDoc.data().role as Role;
      setRole(r);

      if (r === "patient") {
        router.replace("/(patient)/settings");
      } else if (r === "expert") {
        router.replace("/(expert)/dashboard");
      } else {
        throw new Error("Invalid user role");
      }
    },

    logout: async () => {
      await signOut(auth);
      setUser(null);
      setRole(null);
      router.replace("/");
    }
  }), [role, user]);

  return (
    <AuthContext.Provider value={userProfile}>
      {children}
    </AuthContext.Provider>
  );
}