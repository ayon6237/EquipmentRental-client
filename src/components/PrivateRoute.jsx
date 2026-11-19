"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until BetterAuth + Backend JWT sync finishes (prevents redirect on reload!)
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      router.replace("/");
    }
  }, [user, role, loading, allowedRoles, router, pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg text-amber-400"></span>
        <p className="text-slate-400 text-sm">Verifying session...</p>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return null;
  }

  return children;
}