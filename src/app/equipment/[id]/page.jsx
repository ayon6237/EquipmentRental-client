"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { MapPin, Heart, Calendar, ShieldCheck, Package, User, CheckCircle2 } from "lucide-react";

function EquipmentDetailsContent() {
  const { id } = useParams();
  const { role } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    api
      .get(`/equipment/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => toast.error("Failed to load equipment details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToFavorites = async () => {
    try {
      await api.post(`/favorites/${id}`);
      toast.success("Added to your favorites!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Only customers can add favorites");
    }
  };

  // Live Total Amount Preview
  const calculatePreviewTotal = () => {
    if (!item || !startDate || !endDate) return item?.price * quantity || 0;
    const diff = Math.max(1, new Date(endDate) - new Date(startDate));
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    let units = days;
    if (item.rentalType === "Weekly") units = Math.ceil(days / 7);
    if (item.rentalType === "Monthly") units = Math.ceil(days / 30);
    return Math.max(1, units) * item.price * Number(quantity);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (new Date(endDate) < new Date(startDate)) {
      return toast.error("End date must be after start date.");
    }
    setBookingLoading(true);
    try {
      const { data } = await api.post("/bookings/checkout", {
        equipmentId: item._id,
        startDate,
        endDate,
        quantity: Number(quantity),
        contactNumber,
        address,
        notes,
      });

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Make sure Stripe key is configured.");
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-amber-400"></span>
      </div>
    );
  }

  if (!item) {
    return <div className="text-center py-20 text-slate-400">Equipment not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-[420px]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge bg-amber-500/15 text-amber-400 border-amber-500/30">{item.category}</span>
            <span className="badge bg-slate-800 text-slate-300 border-slate-700">{item.condition}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white">{item.name}</h1>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">${item.price}</span>
            <span className="text-slate-400">/ {item.rentalType}</span>
          </div>

          <p className="text-slate-300 leading-relaxed">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400" /> {item.location}
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Package className="w-4 h-4 text-amber-400" /> Available: {item.quantity} unit(s)
            </div>
            {item.brand && (
              <div className="text-slate-400">
                Brand: <span className="text-white">{item.brand}</span>
              </div>
            )}
            {item.model && (
              <div className="text-slate-400">
                Model: <span className="text-white">{item.model}</span>
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-500/15 text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Verified Equipment Owner</p>
              <p className="font-semibold text-white">{item.owner?.name || "Equipment Owner"}</p>
              <p className="text-xs text-slate-400">{item.owner?.email}</p>
            </div>
          </div>

          {/* Rental Terms */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Rental Terms & Conditions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.terms}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              disabled={item.quantity < 1 || role !== "Customer"}
              onClick={() => setModalOpen(true)}
              className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold flex-1"
            >
              <Calendar className="w-4 h-4" />
              {item.quantity < 1 ? "Out of Stock" : role !== "Customer" ? "Customers Only" : "Book Now"}
            </button>

            {role === "Customer" && (
              <button
                onClick={handleAddToFavorites}
                className="btn btn-outline border-slate-700 text-slate-200 hover:border-amber-400 hover:text-amber-400"
              >
                <Heart className="w-4 h-4" /> Add to Favorites
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-1">Book {item.name}</h2>
            <p className="text-xs text-slate-400 mb-5">Complete your rental details to proceed to Stripe Checkout.</p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs text-slate-300">Rental Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="label text-xs text-slate-300">Rental End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs text-slate-300">Required Quantity (Max: {item.quantity})</label>
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="label text-xs text-slate-300">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs text-slate-300">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full delivery address"
                  className="input input-bordered w-full bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="label text-xs text-slate-300">Additional Notes (Optional)</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  className="textarea textarea-bordered w-full bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-400">Estimated Total:</span>
                <span className="text-2xl font-extrabold text-amber-400">${calculatePreviewTotal()}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline border-slate-700 text-slate-300 flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold flex-1"
                >
                  {bookingLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Confirm & Pay
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EquipmentDetailsPage() {
  return (
    <PrivateRoute>
      <EquipmentDetailsContent />
    </PrivateRoute>
  );
}