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

  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const userImage = session?.user?.image || "";

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isPending) return;

      if (userEmail) {
        setLoading(true);
        try {
          // 1. Ensure user exists in Express MongoDB Users collection
          await api.post("/users", {
            name: userName,
            email: userEmail,
            photo: userImage,
          });

          // 2. Generate JWT & save in localStorage (fixes cross-domain & Incognito 401)
          const jwtRes = await api.post("/jwt", { email: userEmail });
          if (jwtRes.data?.token) {
            localStorage.setItem("access-token", jwtRes.data.token);
          }

          // 3. Fetch role & full profile from Express backend
          const { data } = await api.get(`/users/role/${userEmail}`);
          setRole(data.role || "Customer");
          setDbUser(data.user || { name: userName, email: userEmail, image: userImage });
        } catch (err) {
          console.error("Backend auth sync error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        localStorage.removeItem("access-token");
        setDbUser(null);
        setRole("Customer");
        setLoading(false);
      }
    };

    syncUserWithBackend();
  }, [userEmail, userName, userImage, isPending]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Backend logout error:", err);
    } finally {
      localStorage.removeItem("access-token");
      await signOut();
      setDbUser(null);
      setRole("Customer");
    }
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