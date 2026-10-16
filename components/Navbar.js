"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { tellToFetchData } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import CreatorSearch from "@/components/CreatorSearch";
import {
  Home,
  LayoutDashboard,
  UserCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Flame,
} from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { userInfo, clearDataOnLogout, isLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const knownRoutes = ["/", "/dashboard", "/login", "/signup"];
  const isUsernamePage =
    pathname &&
    !knownRoutes.includes(pathname) &&
    !pathname.startsWith("/api") &&
    pathname.split("/").length === 2;

  const handleSignOut = () => {
    localStorage.setItem("logoutSuccess", "true");
    dispatch(tellToFetchData(true));
    clearDataOnLogout();
    signOut({ callbackUrl: "/" });
  };

  const activeUsername = userInfo?.username || session?.user?.username;
  const activeAvatar =
    userInfo?.profilePic || session?.user?.profilePic || "/profilePic.png";

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(activeUsername
      ? [
          {
            href: `/${activeUsername}`,
            label: "My Page",
            icon: UserCircle,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0 focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 p-0.5 shadow-sm transition-colors duration-200 group-hover:bg-red-500">
              <Image
                src="/logo.jpg"
                alt="Get Me A Coke Logo"
                width={38}
                height={38}
                className="rounded-[10px] object-cover w-full h-full"
                priority
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 ring-2 ring-[#09090b]">
                <Flame className="h-2.5 w-2.5 text-white fill-white" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Get Me A <span className="text-red-500">Coke</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 hidden sm:block -mt-1">
                Creator Crowdfunding
              </span>
            </div>
          </Link>

          {/* Creator Search - Show on username pages */}
          {isUsernamePage && (
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <CreatorSearch compact />
            </div>
          )}

          {/* Desktop Navigation */}
          {session && !isLoading ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-zinc-900 border border-white/10 p-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  className="flex items-center gap-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 pl-1.5 pr-3 py-1 text-sm font-medium text-zinc-200 transition-colors cursor-pointer"
                >
                  <Image
                    src={activeAvatar}
                    alt={activeUsername || "User"}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-red-500/40"
                    unoptimized
                  />
                  <span className="hidden lg:inline max-w-[120px] truncate">
                    @{activeUsername}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                      showDropdown ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-900 shadow-2xl py-2 z-50 border border-white/10 divide-y divide-white/10">
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-medium text-zinc-400">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-white truncate mt-0.5">
                        @{activeUsername}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                        Profile Settings
                      </Link>
                      {activeUsername && (
                        <Link
                          href={`/${activeUsername}`}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <UserCircle className="w-4 h-4 text-zinc-400" />
                          Public Creator Page
                        </Link>
                      )}
                    </div>
                    <div className="pt-1">
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowDropdown(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center gap-2.5 cursor-pointer text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 transition-colors hidden sm:inline-block"
              >
                Sign In
              </Link>
              <Link href={pathname === "/login" ? "/signup" : "/login"}>
                <button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {pathname === "/login" ? "Create Account" : "Get Started"}
                  </span>
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {session && !isLoading && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {session && !isLoading && showMobileMenu && (
        <div className="sm:hidden border-t border-white/10 bg-zinc-950">
          <div className="px-4 pt-3 pb-5 space-y-2">
            {isUsernamePage && (
              <div className="pb-2">
                <CreatorSearch compact />
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-red-600/15 text-red-400 border border-red-500/20"
                      : "text-zinc-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="flex items-center gap-3 px-3.5 py-2">
                <Image
                  src={activeAvatar}
                  alt={activeUsername || "User"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-red-500/40"
                  unoptimized
                />
                <div className="text-sm font-medium text-zinc-300 truncate">
                  @{activeUsername}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleSignOut();
                }}
                className="flex w-full items-center gap-3 text-left px-3.5 py-2.5 rounded-xl text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
