"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import useAuth from "@/hooks/useAuth"; // Import your custom hook
import { tellToFetchData } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  // Session data from NextAuth
  const { data: session } = useSession();
  // Redux hook
  const dispatch = useDispatch();
  // Custom auth context
  const { userInfo, clearDataOnLogout, isLoading } = useAuth(); // Access context values
  // States
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Handle sign-out: Clear custom data first, then NextAuth sign-out
  const handleSignOut = () => {
    dispatch(tellToFetchData(true)); // Reset fetch state on logout
    clearDataOnLogout(); // Clear your custom auth data
    signOut(); // Then sign out from NextAuth
  };

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.jpg"
                alt="Get me a Coke Logo"
                width={40}
                height={40}
                className="rounded-full"
                priority
              />
              <span className="text-xl font-bold text-gray-800 hidden sm:block">
                Get me a Coke
              </span>
            </Link>

            {/* Desktop Navigation */}
            {session && !isLoading ? (
              <>
                <div className="hidden md:flex items-center space-x-8">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/${userInfo?.username || session.user.username}`}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Your Page
                  </Link>

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      onBlur={() => {
                        setTimeout(() => setShowDropdown(false), 200);
                      }}
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 pl-6"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{userInfo?.username || session.user.username}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setShowDropdown(false);
                            handleSignOut();
                          }}
                          className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showMobileMenu ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {session && !isLoading && showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href={`/${userInfo?.username || session.user.username}`}
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Your Page
              </Link>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  {userInfo?.username || session.user.username}
                </div>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
