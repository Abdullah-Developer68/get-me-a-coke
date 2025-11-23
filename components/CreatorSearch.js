"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreatorSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Debounced search - waits 300ms after user stops typing
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        // Only search if 2+ characters
        performSearch(searchTerm);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayTimer);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    setIsSearching(true);
    console.log("🔍 Searching for:", query);
    try {
      const response = await fetch(
        `/api/search/creators?query=${encodeURIComponent(query)}`
      );
      console.log("📡 Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Search results:", data);
        console.log("📊 Results count:", data.length);
        setResults(data);
        setShowDropdown(data.length > 0);
        console.log("👁️ Show dropdown:", data.length > 0);
      } else {
        console.error("Search failed:", response.statusText);
        setResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCreator = (username) => {
    router.push(`/${username}`);
    setShowDropdown(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelectCreator(results[0].username);
    }
  };

  return (
    <div
      className="flex w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 justify-center mt-6 md:mt-10 relative px-4 sm:px-0"
      ref={dropdownRef}
    >
      <input
        type="text"
        placeholder="Search for your creator you wish to support!"
        className="rounded-full p-2 sm:p-3 bg-white w-full text-black placeholder:text-black placeholder:italic text-center text-sm sm:text-base hover:bg-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
      />

      {/* Search/Loading Icon */}
      {isSearching && (
        <div className="absolute right-5 top-2">
          <svg
            className="animate-spin h-6 w-6 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Dropdown Modal with Results */}
      {console.log(
        "🎨 Rendering - showDropdown:",
        showDropdown,
        "results:",
        results.length
      )}
      {showDropdown && (
        <div className="absolute top-14 w-full bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50 border border-gray-200">
          {isSearching && results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <svg
                className="animate-spin h-8 w-8 mx-auto mb-2 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 bg-gray-50 border-b text-xs text-gray-500 font-semibold">
                Found {results.length} creator{results.length !== 1 ? "s" : ""}
              </div>
              {results.map((creator, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectCreator(creator.username)}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-red-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <Image
                    src={creator.profilePic || "/burger-dance.gif"}
                    alt={creator.username}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-gray-200 w-10 h-10 sm:w-12 sm:h-12"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-black text-sm sm:text-base lg:text-lg truncate">
                      @{creator.username}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {creator.name}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </>
          ) : (
            <div className="p-6 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 font-medium">No creators found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
