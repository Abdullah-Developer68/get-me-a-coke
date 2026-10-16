"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ChevronRight,
  Loader2,
  X,
  Flame,
} from "lucide-react";

const FALLBACK_POPULAR_CREATORS = [
  {
    username: "mrbeast",
    name: "MrBeast",
    profilePic: "/mrbeast-profile.jpg",
  },
  {
    username: "chai-aur-code",
    name: "Chai aur Code",
    profilePic: "/chai-aur-code-profile.jpg",
  },
  {
    username: "code-with-harry",
    name: "CodeWithHarry",
    profilePic: "/code-with-harry-profile.jpg",
  },
];

export default function CreatorSearch({ compact = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [popularCreators, setPopularCreators] = useState(
    FALLBACK_POPULAR_CREATORS
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Fetch popular creators (mrbeast, chaiaurcode, codewithharry) on mount
  useEffect(() => {
    const fetchPopularCreators = async () => {
      setIsLoadingPopular(true);
      try {
        const response = await fetch("/api/search/creators/popular");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPopularCreators(data);
          }
        }
      } catch (error) {
        console.error("Error fetching popular creators:", error);
      } finally {
        setIsLoadingPopular(false);
      }
    };

    fetchPopularCreators();
  }, []);

  // Debounced search - waits 300ms after user stops typing
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        performSearch(searchTerm);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search/creators?query=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      } else {
        const filtered = FALLBACK_POPULAR_CREATORS.filter(
          (c) =>
            c.username.toLowerCase().includes(query.toLowerCase()) ||
            c.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      const filtered = FALLBACK_POPULAR_CREATORS.filter(
        (c) =>
          c.username.toLowerCase().includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowDropdown(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCreator = (username) => {
    setShowDropdown(false);
    setShowSuggestions(false);
    localStorage.setItem("profilePic", "/profilePic.png");
    localStorage.setItem("coverPic", "/coverImage.jpg");
    router.push(`/${username}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelectCreator(results[0].username);
    }
  };

  const handleFocus = () => {
    if (searchTerm.trim().length === 0) {
      setShowSuggestions(true);
    } else if (results.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div
      className={
        compact
          ? "flex w-full justify-center relative"
          : "flex w-full max-w-xl justify-center mt-6 relative"
      }
      ref={dropdownRef}
    >
      <div className="relative w-full group">
        <div className="relative flex items-center w-full">
          <Search
            className={`absolute left-4 text-zinc-400 group-focus-within:text-red-400 transition-colors pointer-events-none ${
              compact ? "w-4 h-4" : "w-5 h-5"
            }`}
          />
          <input
            type="text"
            placeholder={
              compact
                ? "Search creators (@mrbeast, @chai-aur-code)..."
                : "Search a creator you want to support (e.g., mrbeast)..."
            }
            className={
              compact
                ? "rounded-full pl-10 pr-9 py-2 bg-zinc-900 w-full text-zinc-100 placeholder:text-zinc-500 text-sm hover:bg-zinc-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-white/10"
                : "rounded-2xl pl-12 pr-12 py-4 bg-zinc-900 w-full text-white placeholder:text-zinc-400 text-sm sm:text-base shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500 border border-white/15 hover:border-white/25"
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.trim().length === 0) {
                setShowSuggestions(true);
                setShowDropdown(false);
              } else {
                setShowSuggestions(false);
              }
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />

          {/* Clear or Loading Icon */}
          <div className="absolute right-3.5 flex items-center gap-1.5">
            {isSearching ? (
              <Loader2
                className={`animate-spin text-red-500 ${
                  compact ? "h-4 w-4" : "h-5 w-5"
                }`}
              />
            ) : searchTerm ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setResults([]);
                  setShowDropdown(false);
                  setShowSuggestions(true);
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              !compact && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-zinc-800 border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400">
                  <Sparkles className="w-3 h-3 text-red-400" />
                  Explore
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Modal with Search Results */}
      {showDropdown && (
        <div
          className={`absolute ${
            compact ? "top-12" : "top-16"
          } w-full bg-zinc-900 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 border border-white/15 divide-y divide-white/10`}
        >
          {isSearching && results.length === 0 ? (
            <div className="p-6 text-center text-zinc-400">
              <Loader2 className="animate-spin h-7 w-7 mx-auto mb-2 text-red-500" />
              <p className="text-sm font-medium">Searching creators...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="px-4 py-2.5 bg-zinc-950 text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>
                  Found {results.length} creator
                  {results.length !== 1 ? "s" : ""}
                </span>
                <span className="text-[11px] text-zinc-500">
                  Press Enter to select
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {results.map((creator, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCreator(creator.username)}
                    className="flex items-center gap-3.5 px-4 py-3 hover:bg-zinc-800/80 cursor-pointer transition-colors group"
                  >
                    <Image
                      src={creator.profilePic || "/burger-dance.gif"}
                      alt={creator.username}
                      width={44}
                      height={44}
                      className="rounded-full border border-white/15 w-11 h-11 object-cover shrink-0 group-hover:border-red-500/50 transition-colors"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-red-400 transition-colors">
                        @{creator.username}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {creator.name}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-red-400 transition-colors">
                      Support
                      <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-zinc-200 font-semibold">No creators found</p>
              <p className="text-xs text-zinc-400 mt-1">
                Try searching for @mrbeast, @chai-aur-code, or @code-with-harry
              </p>
            </div>
          )}
        </div>
      )}

      {/* Suggestions Dropdown - shown when input is focused but empty */}
      {showSuggestions && !showDropdown && (
        <div
          className={`absolute ${
            compact ? "top-12" : "top-16"
          } w-full bg-zinc-900 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 border border-white/15 divide-y divide-white/10`}
        >
          <div className="px-4 py-2.5 bg-zinc-950 text-xs text-zinc-300 font-semibold uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            Popular Creators
          </div>
          {isLoadingPopular && popularCreators.length === 0 ? (
            <div className="p-6 text-center text-zinc-400">
              <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-xs">Loading popular creators...</p>
            </div>
          ) : popularCreators.length > 0 ? (
            <div className="divide-y divide-white/5">
              {popularCreators.map((creator, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectCreator(creator.username)}
                  className="flex items-center gap-3.5 px-4 py-3 hover:bg-zinc-800/80 cursor-pointer transition-colors group"
                >
                  <Image
                    src={creator.profilePic || "/profilePic.png"}
                    alt={creator.username}
                    width={44}
                    height={44}
                    className="rounded-full border border-white/15 w-11 h-11 object-cover shrink-0 group-hover:border-red-500/50 transition-colors"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-red-400 transition-colors">
                      @{creator.username}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {creator.name}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-red-400 transition-colors">
                    View Page
                    <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-400 text-sm">
              No popular creators found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
