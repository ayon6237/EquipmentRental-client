"use client";
import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import DashboardShell from "@/components/DashboardShell";
import ProfileSection from "@/components/ProfileSection";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  BarChart3,
  Users,
  Package,
  CalendarClock,
  User,
  DollarSign,
  CheckCircle2,
  Clock,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "analytics", label: "Platform Analytics", icon: BarChart3 },
    { id: "users", label: "All Users", icon: Users },
    { id: "equipment", label: "All Equipment", icon: Package },
    { id: "rentals", label: "All Rentals", icon: CalendarClock },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, equipRes, rentalsRes] = await Promise.all([
        api.get("/analytics/admin"),
        api.get("/users"),
        api.get("/admin/equipment"),
        api.get("/bookings/admin"),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data || []);
      setEquipmentList(equipRes.data || []);
      setRentals(rentalsRes.data || []);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // User Actions
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/role/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // Equipment Actions
  const handleEquipmentStatus = async (id, status) => {
    try {
      await api.patch(`/equipment/status/${id}`, { status });
      setEquipmentList((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
      toast.success(`Equipment ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!confirm("Delete this equipment permanently?")) return;
    try {
      await api.delete(`/equipment/${id}`);
      setEquipmentList((prev) => prev.filter((item) => item._id !== id));
      toast.success("Equipment deleted");
    } catch {
      toast.error("Failed to delete equipment");
    }
  };

  // Rental Action
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
      title="Admin Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. ANALYTICS (Challenge 3) */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "Total Users", value: analytics?.totalUsers ?? 0, icon: Users, color: "text-cyan-400" },
              { label: "Total Equipment", value: analytics?.totalEquipment ?? 0, icon: Package, color: "text-amber-400" },
              { label: "Pending Approvals", value: analytics?.pendingApprovals ?? 0, icon: Clock, color: "text-orange-400" },
              { label: "Total Bookings", value: analytics?.totalBookings ?? 0, icon: CalendarClock, color: "text-indigo-400" },
              { label: "Completed Rentals", value: analytics?.completedRentals ?? 0, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Total Revenue", value: `$${analytics?.totalRevenue ?? 0}`, icon: DollarSign, color: "text-amber-400" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-sm">
                    <span>{stat.label}</span>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-extrabold text-white mt-2">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Monthly Booking & Revenue Chart */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">Monthly Bookings & Revenue</h2>
            {analytics?.monthlyStats?.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="bookings" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-10 text-center">
                No booking data yet. Monthly statistics will appear here as rentals are created.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. ALL USERS */}
      {activeTab === "users" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-200">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-slate-400">Loading users...</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                      <td className="font-semibold text-white">{u.name}</td>
                      <td className="text-slate-400">{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="select select-xs bg-slate-950 border-slate-700 text-white"
                        >
                          <option value="Customer">Customer</option>
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn btn-xs btn-ghost text-red-400"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* 3. ALL EQUIPMENT */}
      {activeTab === "equipment" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                <tr>
                  <th>Equipment</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-200">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-400">Loading equipment...</td></tr>
                ) : equipmentList.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-400">No equipment listed yet.</td></tr>
                ) : (
                  equipmentList.map((item) => (
                    <tr key={item._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                      <td className="font-semibold text-white">{item.name}</td>
                      <td className="text-xs text-slate-400">{item.owner?.name || item.owner?.email}</td>
                      <td>{item.category}</td>
                      <td className="text-amber-400 font-bold">${item.price}/{item.rentalType}</td>
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
                      <td className="text-right space-x-1">
                        {item.status !== "Approved" && (
                          <button
                            onClick={() => handleEquipmentStatus(item._id, "Approved")}
                            className="btn btn-xs bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border-none"
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {item.status !== "Rejected" && (
                          <button
                            onClick={() => handleEquipmentStatus(item._id, "Rejected")}
                            className="btn btn-xs bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-slate-950 border-none"
                            title="Reject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
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

      {/* 4. ALL RENTALS */}
      {activeTab === "rentals" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-950 text-slate-300 text-xs uppercase">
                <tr>
                  <th>Customer</th>
                  <th>Owner</th>
                  <th>Equipment</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-200">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-400">Loading rentals...</td></tr>
                ) : rentals.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-400">No rental bookings yet.</td></tr>
                ) : (
                  rentals.map((b) => (
                    <tr key={b._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                      <td className="text-xs">
                        <p className="font-semibold text-white">{b.customer?.name}</p>
                        <p className="text-slate-400">{b.customer?.email}</p>
                      </td>
                      <td className="text-xs text-slate-400">{b.owner?.name || b.owner?.email}</td>
                      <td className="font-medium text-white">{b.equipment?.name}</td>
                      <td className="text-xs">
                        {new Date(b.startDate).toLocaleDateString()} -{" "}
                        {new Date(b.endDate).toLocaleDateString()}
                      </td>
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

export default function AdminDashboardPage() {
  return (
    <PrivateRoute allowedRoles={["Admin"]}>
      <AdminDashboardContent />
    </PrivateRoute>
  );
}