"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import EquipmentCard from "@/components/EquipmentCard";
import {
  ShieldCheck,
  Clock,
  CreditCard,
  BadgeDollarSign,
  Star,
  HardHat,
  Camera,
  Truck,
  Tractor,
  Cpu,
  Speaker,
  ArrowRight,
  Search,
  CalendarCheck,
  PackageCheck,
} from "lucide-react";

const categories = [
  { name: "Construction Equipment", icon: HardHat, count: "Excavators, Drills & More" },
  { name: "Photography Equipment", icon: Camera, count: "DSLR, Drones & Lighting" },
  { name: "Vehicles & Transportation", icon: Truck, count: "Vans, Trailers & Trucks" },
  { name: "Agriculture Equipment", icon: Tractor, count: "Tractors, Tillers & Sprayers" },
  { name: "Electronics", icon: Cpu, count: "Generators, Projectors & Audio" },
  { name: "Event Equipment", icon: Speaker, count: "Stages, Tents & Sound Systems" },
];

const reviews = [
  {
    name: "Rafiqul Islam",
    role: "Event Manager",
    rating: 5,
    comment: "Rented a full PA sound system and lighting rig for a corporate gala. Seamless Stripe checkout and verified owner!",
  },
  {
    name: "Nusrat Jahan",
    role: "Filmmaker",
    rating: 5,
    comment: "Saved thousands by renting cinema lenses and a drone for a 3-day shoot instead of buying. Equipment was spotless.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Site Contractor",
    rating: 4,
    comment: "Booked a heavy-duty generator and concrete mixer on short notice. Flexible weekly pricing made it super affordable.",
  },
  {
    name: "Mehedi Hasan",
    role: "Farm Owner",
    rating: 5,
    comment: "Transparent terms, instant availability check, and reliable delivery. GearGrid is my go-to rental platform now.",
  },
];

const trustedOwners = [
  { name: "Apex Heavy Rentals", specialty: "Construction & Power Tools", items: "45+ Verified Gear" },
  { name: "CinePro Studios", specialty: "Cameras, Lenses & Drones", items: "32+ Verified Gear" },
  { name: "Metro Event Tech", specialty: "Audio, Lighting & Staging", items: "60+ Verified Gear" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/equipment/featured")
      .then((res) => setFeatured(res.data))
      .catch((err) => console.error("Failed to load featured equipment:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. BANNER SECTION (Framer Motion) */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
            alt="Heavy equipment and professional gear"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Verified Equipment Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Rent Pro-Grade Equipment <span className="text-amber-400">On Demand</span>
            </h1>
            <p className="text-slate-300 text-lg mt-5 leading-relaxed">
              Connect with verified owners to rent construction machinery, cinema cameras, event gear, and more—with transparent pricing and secure Stripe checkout.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/equipment"
                className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold px-6"
              >
                Browse All Equipment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="btn btn-outline border-slate-600 text-white hover:bg-slate-800 px-6"
              >
                List Your Equipment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED EQUIPMENT SECTION (Framer Motion - 6 Approved Items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Equipment</h2>
            <p className="text-slate-400 mt-1">Top-rated, admin-approved gear ready for immediate booking.</p>
          </div>
          <Link href="/equipment" className="text-amber-400 hover:underline font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-14 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-slate-400">No approved equipment available yet. Owners can add items from the dashboard!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featured.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </motion.div>
        )}
      </section>

      {/* 3. CATEGORIES SECTION (Framer Motion) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-white">Browse by Category</h2>
          <p className="text-slate-400 mt-2">Find the exact tools and machinery tailored to your project needs.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 transition-all flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </section>

      {/* 4. WHY CHOOSE US SECTION */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white">Why Choose Equipment Rental Platform?</h2>
            <p className="text-slate-400 mt-2">Built for reliability, transparency, and effortless equipment rentals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BadgeDollarSign, title: "Affordable Pricing", desc: "Competitive daily, weekly, and monthly rates with zero hidden fees." },
              { icon: ShieldCheck, title: "Verified Owners", desc: "Every equipment listing is reviewed and approved by our admin team." },
              { icon: Clock, title: "Flexible Periods", desc: "Rent for a single day or an entire month—book only what you need." },
              { icon: CreditCard, title: "Secure Payments", desc: "Protected online checkout powered by Stripe with instant receipts." },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <Icon className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. EXTRA SECTION 1: HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="text-slate-400 mt-2">Get the equipment you need in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: Search, title: "Search & Compare", desc: "Filter approved equipment by category, location, rental type, and availability." },
            { step: "02", icon: CalendarCheck, title: "Book & Pay Securely", desc: "Select your rental dates, quantity, and complete checkout via Stripe." },
            { step: "03", icon: PackageCheck, title: "Receive & Return", desc: "Get your gear delivered on time and track your booking status in your dashboard." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-5xl font-black text-slate-800 absolute top-4 right-5">{item.step}</span>
                <Icon className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS SECTION (Framer Motion - 4 Reviews) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white">What Our Customers Say</h2>
          <p className="text-slate-400 mt-2">Trusted by contractors, filmmakers, and event organizers nationwide.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {reviews.map((rev) => (
            <div key={rev.name} className="h-full flex flex-col justify-between p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800">
                <p className="font-bold text-white text-sm">{rev.name}</p>
                <p className="text-xs text-slate-400">{rev.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 7. EXTRA SECTION 2: TRUSTED EQUIPMENT OWNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-900/70 border border-slate-800 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-white">Trusted Equipment Owners</h2>
              <p className="text-slate-400 mt-2">
                Partnering with top-rated rental providers who maintain certified, ready-to-use inventory.
              </p>
            </div>
            <Link
              href="/register"
              className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold"
            >
              Become an Owner
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {trustedOwners.map((owner) => (
              <div key={owner.name} className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h3 className="text-lg font-bold text-white">{owner.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{owner.specialty}</p>
                <span className="inline-block mt-3 text-xs font-semibold text-amber-400">{owner.items}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}