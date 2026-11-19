"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Save, User } from "lucide-react";

export default function ProfileSection() {
  const { user, dbUser, role } = useAuth();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(dbUser?.name || user?.name || "");
    setPhoto(dbUser?.photo || user?.image || "");
    setPhone(dbUser?.phone || "");
    setAddress(dbUser?.address || "");
  }, [dbUser, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/users/profile/${user.email}`, {
        name,
        photo,
        phone,
        address,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        {photo ? (
          <img src={photo} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-400" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
            <User className="w-8 h-8" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-white">{name || "User"}</h2>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <span className="badge badge-sm bg-amber-500/20 text-amber-400 border-amber-500/30 mt-1">{role}</span>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-xs text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="label text-xs text-slate-300">Email (Read Only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="input input-bordered w-full bg-slate-950/50 border-slate-800 text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="label text-xs text-slate-300">Profile Image URL</label>
          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-xs text-slate-300">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="label text-xs text-slate-300">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="City, Street Address"
              className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold mt-2"
        >
          {saving ? <span className="loading loading-spinner loading-sm"></span> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}