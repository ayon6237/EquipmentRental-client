"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState("Customer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isPending) return;

      if (session?.user?.email) {
        try {
          // 1. Ensure user exists in Express MongoDB Users collection
          await api.post("/users", {
            name: session.user.name,
            email: session.user.email,
            photo: session.user.image || "",
          });

          // 2. Generate & store HTTP-only JWT cookie
          await api.post("/jwt", { email: session.user.email });

          // 3. Fetch role & full profile from Express backend
          const { data } = await api.get(`/users/role/${session.user.email}`);
          setRole(data.role || "Customer");
          setDbUser(data.user || session.user);
        } catch (err) {
          console.error("Backend auth sync error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setDbUser(null);
        setRole("Customer");
        setLoading(false);
      }
    };

    syncUserWithBackend();
  }, [session, isPending]);

  const handleLogout = async () => {
    await api.post("/logout");
    await signOut();
    setDbUser(null);
    setRole("Customer");
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        dbUser,
        role,
        loading: isPending || loading,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);