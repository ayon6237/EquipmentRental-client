import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Equipment Rental Platform",
  description: "Browse, book, and rent verified equipment with secure online payments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="night" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}