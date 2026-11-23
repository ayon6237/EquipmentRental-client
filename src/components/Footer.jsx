import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white mb-3">
            <span className="p-2 rounded-lg bg-amber-500 text-slate-950">
              <Wrench className="w-5 h-5" />
            </span>
            <span>
              Equipment <span className="text-amber-400">Rental Platform</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed">
            Rent heavy machinery, cameras, event gear, and more from verified owners with secure Stripe payments.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
            <li><Link href="/equipment" className="hover:text-amber-400">All Equipment</Link></li>
            <li><Link href="/login" className="hover:text-amber-400">Login</Link></li>
            <li><Link href="/register" className="hover:text-amber-400">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li>Construction Equipment</li>
            <li>Photography Equipment</li>
            <li>Vehicles & Transportation</li>
            <li>Event Equipment</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex items-center gap-4">
            {/* New X Logo (Required) */}
            <a
              href="https://github.com/ayon6237"
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-amber-400"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ayon-banerjee-ab672324b/"
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-amber-400"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Equipment Rental Platform. All rights reserved.
      </div>
    </footer>
  );
}
