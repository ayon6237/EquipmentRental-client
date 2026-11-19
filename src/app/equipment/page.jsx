"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import EquipmentCard from "@/components/EquipmentCard";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

const CATEGORIES = [
  "All",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

function AllEquipmentContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [rentalType, setRentalType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/equipment", {
        params: {
          search,
          category,
          rentalType,
          minPrice,
          maxPrice,
          availability,
          sort,
          page,
          limit: 9,
        },
      });
      setItems(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [category, rentalType, availability, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEquipment();
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setRentalType("All");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">All Equipment</h1>
        <p className="text-slate-400 mt-1">
          Showing {items.length} of {total} verified equipment listings
        </p>
      </div>

      {/* Search & Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment name or location..."
              className="input input-bordered w-full pl-10 bg-slate-950 border-slate-700 text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="select select-bordered bg-slate-950 border-slate-700 text-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="select select-bordered bg-slate-950 border-slate-700 text-white"
          >
            <option value="newest">Sort: Recently Added</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Second Row: Rental Type, Availability, Price Range, Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800">
          <select
            value={rentalType}
            onChange={(e) => {
              setRentalType(e.target.value);
              setPage(1);
            }}
            className="select select-bordered select-sm bg-slate-950 border-slate-700 text-white h-10"
          >
            <option value="All">All Rental Types</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>

          <select
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value);
              setPage(1);
            }}
            className="select select-bordered select-sm bg-slate-950 border-slate-700 text-white h-10"
          >
            <option value="">All Availability</option>
            <option value="available">Available Now</option>
            <option value="unavailable">Out of Stock</option>
          </select>

          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price ($)"
            className="input input-bordered input-sm bg-slate-950 border-slate-700 text-white h-10"
          />

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price ($)"
            className="input input-bordered input-sm bg-slate-950 border-slate-700 text-white h-10"
          />

          <button
            type="submit"
            className="btn btn-sm h-10 bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" /> Apply
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-sm h-10 btn-outline border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </form>

      {/* 3-Column Equipment Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <p className="text-xl font-semibold text-white">No equipment found</p>
          <p className="text-slate-400 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <EquipmentCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn btn-sm btn-outline border-slate-700 text-slate-200 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-300 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn btn-sm btn-outline border-slate-700 text-slate-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-amber-400"></span></div>}>
      <AllEquipmentContent />
    </Suspense>
  );
}