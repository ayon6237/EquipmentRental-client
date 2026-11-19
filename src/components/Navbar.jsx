"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Wrench, Menu, X, Sun, Moon, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("night");

  useEffect(() => {
    const savedTheme = localStorage.getItem("geargrid-theme") || "night";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "night" ? "corporate" : "night";
    setTheme(nextTheme);
    localStorage.setItem("geargrid-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const getDashboardPath = () => {
    if (role === "Admin") return "/dashboard/admin";
    if (role === "Owner") return "/dashboard/owner";
    return "/dashboard/customer";
  };

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Equipment", href: "/equipment" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Website Name */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <span className="p-2 rounded-lg bg-amber-500 text-slate-950">
            <Wrench className="w-5 h-5" />
          </span>
          <span>
            Gear<span className="text-amber-400">Grid</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? "text-amber-400" : "text-slate-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn btn-ghost btn-sm btn-circle text-slate-300 hover:text-amber-400"
          >
            {theme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <>
              <Link
                href={getDashboardPath()}
                className="btn btn-sm bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="btn btn-sm btn-outline border-slate-700 text-slate-200 hover:bg-red-500/20 hover:border-red-500 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-sm btn-ghost text-slate-200">
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-sm bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden btn btn-ghost btn-sm text-slate-200"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-slate-200 hover:text-amber-400 py-1 font-medium"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
            {user ? (
              <>
                <Link
                  href={getDashboardPath()}
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-sm bg-amber-500 text-slate-950 border-none flex-1"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setMenuOpen(false);
                  }}
                  className="btn btn-sm btn-outline border-slate-700 text-slate-200 flex-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-sm btn-ghost text-slate-200 flex-1"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-sm bg-amber-500 text-slate-950 border-none flex-1"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}