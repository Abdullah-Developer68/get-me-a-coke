import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, Heart, ShieldCheck, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#09090b] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-red-600 p-0.5">
              <Image
                src="/logo.jpg"
                alt="Get Me A Coke"
                width={34}
                height={34}
                className="rounded-[9px] object-cover w-full h-full"
              />
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-1">
                Get Me A <span className="text-red-500">Coke</span>
              </div>
              <p className="text-xs text-zinc-500">
                Refreshing micro-patronage for modern creators.
              </p>
            </div>
          </div>

          {/* Trust Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-white/10 px-3 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Stripe Secured
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-white/10 px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Instant Creator Support
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-white/10 px-3 py-1.5">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              100% Fan Powered
            </span>
          </div>

          {/* Navigation & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1.5 text-xs">
            <div className="flex items-center gap-5 font-medium text-zinc-300">
              <Link href="/" className="hover:text-red-400 transition-colors">
                Home
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-red-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="hover:text-red-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:text-red-400 transition-colors"
              >
                Sign Up
              </Link>
            </div>
            <p className="text-zinc-500 flex items-center gap-1">
              &copy; {new Date().getFullYear()} Get Me A Coke. Crafted with{" "}
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> for
              creators everywhere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
