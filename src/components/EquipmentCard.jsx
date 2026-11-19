"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Tag, CheckCircle2, XCircle } from "lucide-react";

export default function EquipmentCard({ item }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleViewDetails = () => {
    if (!user) {
      router.push(`/login?redirect=/equipment/${item._id}`);
    } else {
      router.push(`/equipment/${item._id}`);
    }
  };

  const isAvailable = item.quantity > 0;

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all shadow-lg">
      {/* Uniform Image Size */}
      <div className="relative h-52 w-full bg-slate-800 overflow-hidden">
        <img
          src={item.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 badge bg-slate-950/85 text-amber-400 border-slate-700 text-xs font-medium">
          <Tag className="w-3 h-3 mr-1" /> {item.category}
        </span>
        <span
          className={`absolute top-3 right-3 badge border-none text-xs font-semibold ${
            isAvailable ? "bg-emerald-500/90 text-slate-950" : "bg-red-500/90 text-white"
          }`}
        >
          {isAvailable ? (
            <><CheckCircle2 className="w-3 h-3 mr-1" /> Available</>
          ) : (
            <><XCircle className="w-3 h-3 mr-1" /> Out of Stock</>
          )}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1">{item.name}</h3>
          <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-amber-400">${item.price}</span>
            <span className="text-xs text-slate-400"> / {item.rentalType}</span>
          </div>
          <button
            onClick={handleViewDetails}
            className="btn btn-sm bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}