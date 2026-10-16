import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#09090b] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-red-600 p-0.5">
              <Image
                src="/logo.jpg"
                alt="Get Me A Coke"
                width={30}
                height={30}
                className="rounded-[9px] object-cover w-full h-full"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                Get Me A <span className="text-red-500">Coke</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Refreshing micro-patronage for creators.
              </p>
            </div>
          </Link>

          {/* Right Navigation & Clean Copyright */}
          <div className="flex flex-col items-center sm:items-end gap-1.5 text-xs">
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
            <p className="text-zinc-500 whitespace-nowrap">
              &copy; {new Date().getFullYear()} Get Me A Coke &middot; All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
