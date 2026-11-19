"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import DashboardShell from "@/components/DashboardShell";
import ProfileSection from "@/components/ProfileSection";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { CalendarCheck, Heart, User, Trash2, Eye } from "lucide-react";

function CustomerDashboardContent() {
  const [activeTab, setActiveTab] = useState("rentals");
  const [rentals, setRentals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "rentals", label: "My Rentals", icon: CalendarCheck },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [rentalsRes, favRes] = await Promise.all([
        api.get("/bookings/customer"),
        api.get("/favorites"),
      ]);
      setRentals(rentalsRes.data || []);
      setFavorites(favRes.data || []);
    } catch (err) {
      console.error("Failed to load customer dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveFavorite = async (equipmentId) => {
    try {
      await api.delete(`/favorites/${equipmentId}`);
      setFavorites((prev) => prev.filter((item) => item._id !== equipmentId));
      toast.success("Removed from favorites");
    } catch {
      toast.error("Failed to remove favorite");
    }
  };

  return (
    <DashboardShell
      title="Customer Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. MY RENTALS */}
      {activeTab === "rentals" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                <tr>
                  <th>Equipment Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Booking Date</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-200">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-400">Loading rentals...</td></tr>
                ) : rentals.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-400">You have no rental bookings yet.</td></tr>
                ) : (
                  rentals.map((b) => (
                    <tr key={b._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                      <td className="font-semibold text-white">{b.equipment?.name || "Equipment"}</td>
                      <td>{new Date(b.startDate).toLocaleDateString()}</td>
                      <td>{new Date(b.endDate).toLocaleDateString()}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="font-bold text-amber-400">${b.totalAmount}</td>
                      <td>
                        <span className={`badge badge-sm border-none ${b.paymentStatus === "Paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-sm bg-slate-800 text-slate-200 border-slate-700">
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. FAVORITES */}
      {activeTab === "favorites" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-200">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-slate-400">Loading favorites...</td></tr>
                ) : favorites.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-slate-400">No favorite equipment saved yet.</td></tr>
                ) : (
                  favorites.map((item) => (
                    <tr key={item._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                      <td className="font-semibold text-white">{item.name}</td>
                      <td>{item.category}</td>
                      <td className="text-amber-400 font-bold">${item.price}/{item.rentalType}</td>
                      <td>{item.location}</td>
                      <td className="text-right space-x-2">
                        <Link
                          href={`/equipment/${item._id}`}
                          className="btn btn-xs bg-amber-500 hover:bg-amber-400 text-slate-950 border-none"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(item._id)}
                          className="btn btn-xs btn-outline border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
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

      {/* 3. PROFILE */}
      {activeTab === "profile" && <ProfileSection />}
    </DashboardShell>
  );
}

export default function CustomerDashboardPage() {
  return (
    <PrivateRoute allowedRoles={["Customer"]}>
      <CustomerDashboardContent />
    </PrivateRoute>
  );
}