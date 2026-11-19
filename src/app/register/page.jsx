"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { UserPlus, Upload } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const uploadToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey || apiKey === "your_imgbb_api_key") {
      throw new Error("ImgBB API key not configured. Please use a direct image URL.");
    }
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.display_url;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Assignment Password Validation Rules
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      return toast.error("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      return toast.error("Password must contain at least one lowercase letter.");
    }

    setSubmitting(true);
    try {
      let finalImage = photoUrl;
      if (photoFile) {
        finalImage = await uploadToImgBB(photoFile);
      }

      const { error } = await signUp.email({
        name,
        email,
        password,
        image: finalImage || "https://i.ibb.co/4pDNDk1/avatar.png",
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        setSubmitting(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join GearGrid to rent or list equipment</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label text-sm text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ayon Banerjee"
              className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="label text-sm text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="label text-sm text-slate-300">Photo URL (or upload below)</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="label text-sm text-slate-300 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" /> Or Upload Photo (ImgBB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full bg-slate-950 border-slate-700 text-slate-300"
            />
          </div>

          <div>
            <label className="label text-sm text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
              className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
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
                <UserPlus className="w-4 h-4" /> Register
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-400 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}