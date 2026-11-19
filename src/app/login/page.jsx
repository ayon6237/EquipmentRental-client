"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await signIn.email({ email, password });

    if (error) {
      toast.error(error.message || "Invalid email or password");
      setSubmitting(false);
      return;
    }

    toast.success("Logged in successfully!");
    router.push(redirectPath);
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: redirectPath,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage your rentals on GearGrid</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="label text-sm text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10 bg-slate-950 border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="label text-sm text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 bg-slate-950 border-slate-700 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn w-full bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold mt-2"
          >
            {submitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Login
              </>
            )}
          </button>
        </form>

        <div className="divider text-slate-500 text-xs my-6">OR</div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="btn btn-outline w-full border-slate-700 text-slate-200 hover:bg-slate-800"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-400 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-amber-400"></span></div>}>
      <LoginForm />
    </Suspense>
  );
}