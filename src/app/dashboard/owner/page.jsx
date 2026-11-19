"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import DashboardShell from "@/components/DashboardShell";
import ProfileSection from "@/components/ProfileSection";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  BarChart3,
  PlusCircle,
  Package,
  CalendarClock,
  User,
  Trash2,
  Eye,
  Edit3,
  DollarSign,
  CheckCircle2,
  Upload,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const INITIAL_FORM = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  location: "",
  price: "",
  rentalType: "Daily",
  quantity: 1,
  condition: "Like New",
  brand: "",
  model: "",
  image: "",
  terms: "Return in clean working condition. Late returns incur daily charges.",
};

function OwnerDashboardContent() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Equipment Form State
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const tabs = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "add", label: editingId ? "Edit Equipment" : "Add Equipment", icon: PlusCircle },
    { id: "equipment", label: "My Equipment", icon: Package },
    { id: "rentals", label: "My Equipment Rentals", icon: CalendarClock },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, equipRes, rentalsRes] = await Promise.all([
        api.get("/analytics/owner"),
        api.get("/owner/equipment"),
        api.get("/bookings/owner"),
      ]);
      setAnalytics(analyticsRes.data);
      setEquipmentList(equipRes.data || []);
      setRentals(rentalsRes.data || []);
    } catch (err) {
      console.error("Failed to load owner dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const uploadToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey || apiKey === "your_imgbb_api_key") {
      throw new Error("ImgBB API key not set. Please paste an image URL instead.");
    }
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error("ImgBB upload failed");
    return data.data.display_url;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }
      if (!imageUrl) {
        toast.error("Please provide an image URL or upload an image.");
        setSubmitting(false);
        return;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        image: imageUrl,
      };

      if (editingId) {
        await api.patch(`/equipment/${editingId}`, payload);
        toast.success("Equipment updated successfully!");
      } else {
        await api.post("/equipment", payload);
        toast.success("Equipment added! Pending admin approval.");
      }

      setForm(INITIAL_FORM);
      setImageFile(null);
      setEditingId(null);
      await loadOwnerData();
      setActiveTab("equipment");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      location: item.location,
      price: item.price,
      rentalType: item.rentalType,
      quantity: item.quantity,
      condition: item.condition,
      brand: item.brand || "",
      model: item.model || "",
      image: item.image,
      terms: item.terms,
    });
    setEditingId(item._id);
    setActiveTab("add");
  };

  const handleDeleteEquipment = async (id) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;
    try {
      await api.delete(`/equipment/${id}`);
      setEquipmentList((prev) => prev.filter((item) => item._id !== id));
      toast.success("Equipment deleted");
    } catch {
      toast.error("Failed to delete equipment");
    }
  };

  const handleBookingStatusChange = async (bookingId, bookingStatus) => {
    try {
      await api.patch(`/bookings/status/${bookingId}`, { bookingStatus });
      setRentals((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus } : b))
      );
      toast.success(`Booking marked as ${bookingStatus}`);
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  return (
    <DashboardShell
      title="Owner Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. ANALYTICS (Challenge 3) */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Total Listed Equipment</span>
                <Package className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-white mt-2">
                {analytics?.totalListedEquipment ?? 0}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Completed Rentals</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-white mt-2">
                {analytics?.completedRentals ?? 0}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Total Earnings</span>
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400 mt-2">
                ${analytics?.totalEarnings ?? 0}
              </p>
            </div>
          </div>

          {/* Monthly Earnings Chart */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">Monthly Earnings Overview</h2>
            {analytics?.monthlyEarnings?.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff" }}
                    />
                    <Bar dataKey="earnings" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-10 text-center">
                No paid bookings yet. Monthly earnings chart will appear here once customers book your gear.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. ADD / EDIT EQUIPMENT */}
      {activeTab === "add" && (
        <form
          onSubmit={handleFormSubmit}
          className="max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Update Equipment" : "Add New Equipment"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(INITIAL_FORM);
                }}
                className="btn btn-xs btn-ghost text-slate-400"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs text-slate-300">Equipment Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sony FX3 Cinema Camera"
                className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="label text-xs text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="select select-bordered w-full bg-slate-950 border-slate-700 text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label text-xs text-slate-300">Description</label>
            <textarea
              rows="3"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed specs and usage instructions..."
              className="textarea textarea-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label text-xs text-slate-300">Rental Price ($)</label>
              <input
                type="number"
                min="1"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="label text-xs text-slate-300">Rental Type</label>
              <select
                value={form.rentalType}
                onChange={(e) => setForm({ ...form, rentalType: e.target.value })}
                className="select select-bordered w-full bg-slate-950 border-slate-700 text-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="label text-xs text-slate-300">Available Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs text-slate-300">Location</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Dhaka / Khulna"
                className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="label text-xs text-slate-300">Equipment Condition</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="select select-bordered w-full bg-slate-950 border-slate-700 text-white"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs text-slate-300">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="e.g., Bosch, Sony, Caterpillar"
                className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="label text-xs text-slate-300">Model</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="e.g., FX3 / GSB 500"
                className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs text-slate-300">Equipment Image URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="label text-xs text-slate-300 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-amber-400" /> Or Upload via ImgBB
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full bg-slate-950 border-slate-700 text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="label text-xs text-slate-300">Rental Terms & Conditions</label>
            <textarea
              rows="2"
              required
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              className="textarea textarea-bordered w-full bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold"
          >
            {submitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : editingId ? (
              "Update Equipment"
            ) : (
              "Submit Equipment"
            )}
          </button>
        </form>
      )}

      {/* 3. MY EQUIPMENT */}
      {activeTab === "equipment" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                <tr>
                  <th>Equipment Name</th>
                  <th>Category</th>
                  <th>Rental Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-200">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-400">Loading equipment...</td></tr>
                ) : equipmentList.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-400">You haven&apos;t added any equipment yet.</td></tr>
                ) : (
                  equipmentList.map((item) => (
                    <tr key={item._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                      <td className="font-semibold text-white">{item.name}</td>
                      <td>{item.category}</td>
                      <td className="text-amber-400 font-bold">${item.price}/{item.rentalType}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <span
                          className={`badge badge-sm border-none ${
                            item.status === "Approved"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : item.status === "Rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="text-right space-x-1.5">
                        <Link
                          href={`/equipment/${item._id}`}
                          className="btn btn-xs btn-ghost text-slate-300"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="btn btn-xs btn-ghost text-amber-400"
                          title="Update"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(item._id)}
                          className="btn btn-xs btn-ghost text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MY EQUIPMENT RENTALS */}
      {activeTab === "rentals" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                <tr>
                  <th>Customer Info</th>
                  <th>Equipment</th>
                  <th>Duration</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-200">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-400">Loading rentals...</td></tr>
                ) : rentals.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-400">No rentals for your equipment yet.</td></tr>
                ) : (
                  rentals.map((b) => (
                    <tr key={b._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                      <td>
                        <p className="font-semibold text-white">{b.customer?.name}</p>
                        <p className="text-xs text-slate-400">{b.customer?.email}</p>
                      </td>
                      <td className="font-medium text-white">{b.equipment?.name}</td>
                      <td className="text-xs">
                        {new Date(b.startDate).toLocaleDateString()} -{" "}
                        {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td>{b.quantity}</td>
                      <td className="text-amber-400 font-bold">${b.totalAmount}</td>
                      <td>
                        <span className={`badge badge-sm border-none ${b.paymentStatus === "Paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          value={b.bookingStatus}
                          onChange={(e) => handleBookingStatusChange(b._id, e.target.value)}
                          className="select select-xs bg-slate-950 border-slate-700 text-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PROFILE */}
      {activeTab === "profile" && <ProfileSection />}
    </DashboardShell>
  );
}

export default function OwnerDashboardPage() {
  return (
    <PrivateRoute allowedRoles={["Owner"]}>
      <OwnerDashboardContent />
    </PrivateRoute>
  );
}