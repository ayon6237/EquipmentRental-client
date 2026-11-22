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
  CheckCircle2,
} from "lucide-react";

const categories = [
  { name: "Construction Equipment", icon: HardHat, count: "Excavators, Drills & More" },
  { name: "Photography Equipment", icon: Camera, count: "DSLR, Drones & Lighting" },
  { name: "Vehicles & Transportation", icon: Truck, count: "Vans, Trailers & Trucks" },
  { name: "Agriculture Equipment", icon: Tractor, count: "Tractors, Tillers & Sprayers" },
  { name: "Electronics", icon: Cpu, count: "Generators, Projectors & Audio" },
  { name: "Event Equipment", icon: Speaker, count: "Stages, Tents & Sound Systems" },
];

// Curated thumbnail & short description map for dynamic Popular Categories
const categoryMeta = {
  "Agriculture Equipment": {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
    desc: "Farm tractors, tillers & sprayers",
  },
  "Cleaning Equipment": {
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80",
    desc: "Industrial pressure washers & vacs",
  },
  "Construction Equipment": {
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
    desc: "Heavy machinery, drills & mixers",
  },
  Electronics: {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    desc: "Generators, projectors & pro audio",
  },
  "Event Equipment": {
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
    desc: "Stages, lighting & sound systems",
  },
  "Photography Equipment": {
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
    desc: "Cinema cameras, lenses & drones",
  },
  "Vehicles & Transportation": {
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=80",
    desc: "Cargo vans, trailers & utility trucks",
  },
};

const fallbackCategoryImage =
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80";

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
  const [popularCategories, setPopularCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch featured equipment
    api
      .get("/equipment/featured")
      .then((res) => setFeatured(res.data || []))
      .catch((err) => console.error("Failed to load featured equipment:", err))
      .finally(() => setLoading(false));

    // 2. Fetch approved equipment to build dynamic Popular Categories in real time
    api
      .get("/equipment?limit=100")
      .then((res) => {
        const items = res.data?.data || [];
        const grouped = {};

        items.forEach((item) => {
          const catName = item.category?.trim();
          if (!catName) return;

          if (!grouped[catName]) {
            const meta = categoryMeta[catName];
            grouped[catName] = {
              name: catName,
              count: 0,
              image: meta?.image || item.image || fallbackCategoryImage,
              desc: meta?.desc || "Verified professional rental gear",
            };
          }
          grouped[catName].count += 1;
        });

        // Sort by highest item count first, show top 5 categories
        const dynamicList = Object.values(grouped)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setPopularCategories(dynamicList);
      })
      .catch((err) => console.error("Failed to load popular categories:", err))
      .finally(() => setCategoriesLoading(false));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. BANNER SECTION (Framer Motion + Right-Side Hero Visual) */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
            alt="Heavy equipment and professional gear"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/75" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Verified Equipment Marketplace
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Rent Pro-Grade Equipment <span className="text-amber-400">On Demand</span>
              </h1>
              <p className="text-slate-300 text-lg mt-5 leading-relaxed max-w-xl">
                Connect with verified owners to rent construction machinery, cinema cameras, event gear, and more—with transparent pricing and secure Stripe checkout.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/equipment"
                  className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold px-6"
                >
                  Browse All Equipment <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right Relevant Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-amber-500/20 blur-2xl opacity-50" />
                <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80"
                    alt="Industrial machinery and pro rental tools in action"
                    className="w-full h-72 sm:h-80 lg:h-[380px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">100% Admin-Approved</p>
                        <p className="text-xs text-slate-400">Inspected gear ready for dispatch</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                      Instant Pay
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES SECTION (Dynamic Real-Time DB Counts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-10 bg-slate-700" />
            <h2 className="text-3xl font-bold text-white">Popular Categories</h2>
            <span className="h-[1px] w-10 bg-slate-700" />
          </div>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Explore verified equipment categories from our real-time database
          </p>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl bg-slate-900 animate-pulse border border-slate-800"
              />
            ))}
          </div>
        ) : popularCategories.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">
              Categories will appear automatically once approved equipment is listed.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
          >
            {popularCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/80 hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-amber-500/10 hover:shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 group-hover:border-amber-500/60 mb-4 bg-slate-950 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      e.currentTarget.src = fallbackCategoryImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
                  {cat.desc}
                </p>
                <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 group-hover:bg-amber-500/15 group-hover:text-amber-400 border border-slate-700/80 group-hover:border-amber-500/30 transition-colors">
                  {cat.count} {cat.count === 1 ? "item" : "items"}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </section>

      {/* 3. FEATURED EQUIPMENT SECTION (Framer Motion - 6 Approved Items) */}
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

      {/* 4. CATEGORIES SECTION (Framer Motion) */}
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

      {/* 5. WHY CHOOSE US SECTION */}
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

      {/* 6. EXTRA SECTION 1: HOW IT WORKS */}
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

      {/* 7. CUSTOMER REVIEWS SECTION (Framer Motion - 4 Reviews) */}
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

      {/* 8. EXTRA SECTION 2: TRUSTED EQUIPMENT OWNERS */}
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