/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { tellToFetchData } from "@/redux/slices/userSlice";
import { fetchUpdatedUserInfo } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Copy,
  Check,
  Trophy,
  Heart,
  Sparkles,
  Users,
  DollarSign,
  Gift,
  MessageSquareHeart,
  ShieldCheck,
  Loader2,
  Crown,
  Flame,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

const PRESET_PROFILES = {
  mrbeast: {
    profilePic: "/mrbeast-profile.jpg",
    tagline: "Pushing the boundaries of creator entertainment & philanthropy!",
  },
  "chai-aur-code": {
    profilePic: "/chai-aur-code-profile.jpg",
    tagline: "Sipping Chai & building production-grade software together.",
  },
  "code-with-harry": {
    profilePic: "/code-with-harry-profile.jpg",
    tagline: "Making coding simple, practical, and accessible for everyone.",
  },
};

const QUICK_TIERS = [
  { amount: 10, label: "1 Coke", badge: "Starter" },
  { amount: 50, label: "5 Cokes", badge: "Popular" },
  { amount: 100, label: "10 Cokes", badge: "Superfan" },
];

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

const Username = () => {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const username =
    typeof routeParams?.username === "string"
      ? routeParams.username
      : Array.isArray(routeParams?.username)
      ? routeParams.username[0]
      : "creator";

  const isFetch = useSelector((state) => state.user.fetch);

  const { userInfo, status } = useAuth();
  const isSessionLoading = status === "loading";

  // states
  const [supporterName, setSupporterName] = useState("");
  const [supporterMessage, setSupporterMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payData, setPayData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [uniqueSupporters, setUniqueSupporters] = useState(0);
  const [topSupporters, setTopSupporters] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [averageAmount, setAverageAmount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const [profile, setProfile] = useState(
    PRESET_PROFILES[username]?.profilePic || "/profilePic.png"
  );
  const [cover, setCover] = useState("/coverImage.jpg");
  const [tagline, setTagline] = useState(() => {
    if (PRESET_PROFILES[username]?.tagline) {
      return PRESET_PROFILES[username].tagline;
    }
    try {
      const storedUserInfo = localStorage.getItem("userInfo");
      return storedUserInfo
        ? JSON.parse(storedUserInfo).tagline || "Check out my content!"
        : "Check out my content!";
    } catch {
      return "Check out my content!";
    }
  });

  // Initialize localStorage values on client side only
  useEffect(() => {
    const cachedProfile = localStorage.getItem("profilePic");
    const cachedCover = localStorage.getItem("coverPic");

    if (
      cachedProfile &&
      cachedProfile !== "null" &&
      cachedProfile !== "undefined"
    ) {
      setProfile(cachedProfile);
    }
    if (cachedCover && cachedCover !== "null" && cachedCover !== "undefined") {
      setCover(cachedCover);
    }

    setProfileUrl(window.location.href);
  }, []);

  const fetchUserInfo = async (targetUsername) => {
    const res = await fetchUpdatedUserInfo(targetUsername);
    if (res) {
      dispatch(tellToFetchData(false));
      const profilePic =
        res.profilePic ||
        PRESET_PROFILES[targetUsername]?.profilePic ||
        "/profilePic.png";
      const coverPic = res.coverPic || "/coverImage.jpg";
      const userTagline =
        res.tagline ||
        PRESET_PROFILES[targetUsername]?.tagline ||
        "Check out my content!";
      setProfile(profilePic);
      setCover(coverPic);
      setTagline(userTagline);
      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("coverPic", coverPic);
    } else if (PRESET_PROFILES[targetUsername]) {
      setProfile(PRESET_PROFILES[targetUsername].profilePic);
      setTagline(PRESET_PROFILES[targetUsername].tagline);
    }
  };

  useEffect(() => {
    if (userInfo?.username === username) {
      setProfile(userInfo.profilePic || "/profilePic.png");
      setCover(userInfo.coverPic || "/coverImage.jpg");
      setTagline(userInfo.tagline || "Check out my content!");

      localStorage.setItem(
        "profilePic",
        userInfo.profilePic || "/profilePic.png"
      );
      localStorage.setItem("coverPic", userInfo.coverPic || "/coverImage.jpg");
    } else {
      fetchUserInfo(username);
    }
  }, [username, userInfo]);

  const startCheckout = async (amt) => {
    if (!amt) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amt),
          name: supporterName,
          message: supporterMessage,
          username,
          email: userInfo?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create session");

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getRecentPaymentInfo = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/payment?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPayData(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch recent payments:", err);
    }
  }, [username]);

  const getStats = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/payment/stats?username=${encodeURIComponent(username)}`
      );
      if (res.ok) {
        const data = await res.json();
        setTotalAmount(data?.totalAmount || 0);
        setAverageAmount(data?.averageAmount || 0);
        setUniqueSupporters(data?.uniqueSupporters || 0);
        setTopSupporters(data?.topSupporters || []);
        setTotalDonations(data?.count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch payment stats:", err);
    }
  }, [username]);

  useEffect(() => {
    getRecentPaymentInfo();
    getStats();
  }, [getRecentPaymentInfo, getStats]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Coke URL copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center w-full pb-16 sm:pb-20">
        {/* HERO COVER & CREATOR HEADER */}
        <div className="relative w-full">
          {/* Cover Image Container */}
          <div
            className="relative w-full h-[180px] sm:h-[280px] md:h-[380px] overflow-hidden bg-zinc-900 border-b border-white/10"
            aria-busy={isSessionLoading}
          >
            {cover ? (
              <Image
                src={cover}
                alt="Creator cover banner"
                width={1920}
                height={480}
                priority
                className="w-full h-full object-cover object-center"
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 animate-pulse" />
            )}
          </div>

          {/* Creator Identity Card Arranged Vertically */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-14 sm:-mt-20 md:-mt-24 relative z-10">
            <div className="rounded-3xl bg-zinc-900 border border-white/15 p-5 sm:p-8 shadow-2xl flex flex-col items-center text-center">
              {/* Avatar centered on top */}
              <div className="relative -mt-16 sm:-mt-20 mb-3 sm:mb-4 shrink-0">
                {profile ? (
                  <Image
                    src={profile}
                    alt={username}
                    width={128}
                    height={128}
                    priority
                    sizes="128px"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-zinc-950 ring-2 ring-white/20 bg-zinc-900 shadow-2xl"
                    unoptimized
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-zinc-800 animate-pulse" />
                )}
              </div>

              {/* Username + Badge */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2 max-w-full">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight break-all sm:break-normal">
                  @{username}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                  Creator
                </span>
              </div>

              {/* Tagline */}
              <p className="text-xs sm:text-base text-zinc-300 max-w-xl mb-4 px-1">
                {isSessionLoading ? "Loading profile..." : tagline}
              </p>

              {/* Copy Profile Link Pill */}
              <div className="flex items-center justify-between sm:justify-center gap-2 rounded-full bg-zinc-950 border border-white/15 pl-3.5 sm:pl-4 pr-1.5 sm:pr-2 py-1.5 w-full sm:w-auto max-w-full mb-6">
                <span className="text-xs text-zinc-400 truncate min-w-0 flex-1 sm:flex-initial sm:max-w-[320px] font-mono text-left">
                  {profileUrl}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white border border-white/10 transition-colors cursor-pointer shrink-0"
                  title={copied ? "Copied!" : "Copy link"}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Creator Stats Bar - Neutral White Icons */}
              <div className="w-full pt-5 sm:pt-6 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-4 text-center sm:text-left">
                <div className="rounded-2xl bg-zinc-950 border border-white/10 p-2.5 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 min-w-0">
                  <div className="hidden sm:flex h-10 w-10 rounded-xl bg-zinc-800 border border-white/10 items-center justify-center text-white shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base sm:text-2xl font-extrabold text-white truncate">
                      {totalDonations}
                    </p>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate">
                      Donations
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-zinc-950 border border-white/10 p-2.5 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 min-w-0">
                  <div className="hidden sm:flex h-10 w-10 rounded-xl bg-zinc-800 border border-white/10 items-center justify-center text-white shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base sm:text-2xl font-extrabold text-white truncate">
                      {uniqueSupporters}
                    </p>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate">
                      Supporters
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-zinc-950 border border-white/10 p-2.5 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 min-w-0">
                  <div className="hidden sm:flex h-10 w-10 rounded-xl bg-zinc-800 border border-white/10 items-center justify-center text-white shrink-0">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base sm:text-2xl font-extrabold text-white truncate">
                      ${totalAmount / 100}
                    </p>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate">
                      Total Raised
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN 2-COLUMN CONTENT: LEADERBOARD + DONATION CHECKOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-6 sm:mt-8 w-full max-w-5xl px-4 sm:px-6">
          {/* Left Column: Top Supporters & Recent Activity */}
          <div className="lg:col-span-6 flex flex-col gap-6 order-2 lg:order-1">
            {/* Top Supporters Leaderboard Card */}
            <div className="rounded-3xl bg-zinc-900 border border-white/15 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25">
                    <Crown className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      Top Supporters
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Ranked by total micro-patronage
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-950 border border-white/10 px-2.5 py-1 rounded-full">
                  {topSupporters.length} Ranked
                </span>
              </div>

              {topSupporters.length > 0 ? (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600">
                  {topSupporters.map((s, idx) => {
                    const cokesCount = Math.round(s.totalAmount / 1000);
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl p-3 sm:p-3.5 transition-colors border ${
                          idx === 0
                            ? "bg-amber-500/10 border-amber-500/30"
                            : idx === 1
                            ? "bg-zinc-800/60 border-zinc-500/30"
                            : idx === 2
                            ? "bg-amber-900/15 border-amber-700/30"
                            : "bg-zinc-950 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Rank Icon + Name + Details */}
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Modern Rank Badge Icon */}
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl font-extrabold text-xs shrink-0 border ${
                                idx === 0
                                  ? "bg-amber-400 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/20"
                                  : idx === 1
                                  ? "bg-zinc-200 text-zinc-950 border-white shadow-md shadow-zinc-400/20"
                                  : idx === 2
                                  ? "bg-amber-700 text-amber-100 border-amber-600 shadow-md shadow-amber-900/20"
                                  : "bg-zinc-900 text-zinc-300 border-white/10"
                              }`}
                            >
                              {idx === 0 ? (
                                <Crown className="w-4 h-4 fill-zinc-950" />
                              ) : (
                                `#${idx + 1}`
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-white text-sm truncate">
                                {s.name || "Anonymous Fan"}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Image
                                    src="/logo.jpg"
                                    alt="Coke"
                                    width={12}
                                    height={12}
                                    className="rounded-full object-cover shrink-0"
                                  />
                                  <span>
                                    {cokesCount > 0
                                      ? `${cokesCount} ${
                                          cokesCount === 1 ? "Coke" : "Cokes"
                                        }`
                                      : "Supporter"}
                                  </span>
                                </span>
                                {s.count && s.count > 1 && (
                                  <>
                                    <span>&middot;</span>
                                    <span>{s.count} gifts</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Donated Amount Badge */}
                          <div className="flex flex-col items-end shrink-0">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                                idx === 0
                                  ? "bg-amber-400/20 border-amber-400/40 text-amber-300"
                                  : idx === 1
                                  ? "bg-zinc-100/15 border-zinc-300/30 text-zinc-200"
                                  : idx === 2
                                  ? "bg-amber-600/20 border-amber-600/40 text-amber-200"
                                  : "bg-zinc-900 border-white/10 text-zinc-300"
                              }`}
                            >
                              ${s.totalAmount / 100}
                            </span>
                            {s.lastPaymentAt && (
                              <span className="text-[10px] text-zinc-500 mt-1 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {formatTimeAgo(s.lastPaymentAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-2xl bg-zinc-950 border border-dashed border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-2 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-300">
                    No supporters on the leaderboard yet
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Buy the first Coke to claim the #1 spot!
                  </p>
                </div>
              )}
            </div>

            {/* Recent Donations Live Feed Card */}
            <div className="rounded-3xl bg-zinc-900 border border-white/15 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/25">
                    <MessageSquareHeart className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      Recent Donations
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Live supporter messages & tips
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-950 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Feed ({payData.length})
                </span>
              </div>

              {payData.length > 0 ? (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600">
                  {payData.map((s, idx) => {
                    const cokesGiven = Math.round((s.amount || 0) / 1000);
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl bg-zinc-950 border border-white/10 p-3.5 sm:p-4 space-y-2 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-600 p-1">
                              <Image
                                src="/logo.jpg"
                                alt="Coke"
                                width={24}
                                height={24}
                                className="rounded-lg object-cover w-full h-full"
                              />
                            </span>
                            <div className="min-w-0">
                              <span className="font-semibold text-white text-sm truncate block">
                                {s.name || "Generous Supporter"}
                              </span>
                              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                {cokesGiven > 0 ? (
                                  <span>
                                    Bought {cokesGiven}{" "}
                                    {cokesGiven === 1 ? "Coke" : "Cokes"}
                                  </span>
                                ) : (
                                  <span>Tipped creator</span>
                                )}
                                {s.createdAt && (
                                  <>
                                    <span>&middot;</span>
                                    <span>{formatTimeAgo(s.createdAt)}</span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-300 shrink-0">
                            +${s.amount / 100}
                          </span>
                        </div>
                        {s.message && (
                          <p className="text-xs sm:text-sm text-zinc-300 bg-zinc-900 rounded-xl px-3.5 py-2 border border-white/5 italic break-words">
                            &ldquo;{s.message}&rdquo;
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-2xl bg-zinc-950 border border-dashed border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 p-0.5 mb-2 flex items-center justify-center">
                    <Image
                      src="/logo.jpg"
                      alt="Coke"
                      width={44}
                      height={44}
                      className="rounded-[14px] object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm font-semibold text-zinc-300">
                    No donations yet
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Be the first to buy @{username} an ice-cold Coke!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Make a Payment Card (shown first on mobile for easy conversion) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="rounded-3xl bg-zinc-900 border border-white/15 p-5 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white break-words">
                      Buy @{username} a Coke
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Send a direct tip and leave a public fan message.
                    </p>
                  </div>
                  <div className="relative w-10 h-10 rounded-xl bg-red-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                    <Image
                      src="/logo.jpg"
                      alt="Coke"
                      width={36}
                      height={36}
                      className="rounded-[9px] object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Quick Tier Selector Buttons */}
                <div className="mb-5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2.5">
                    Quick Select Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {QUICK_TIERS.map((tier) => {
                      const isSelected = Number(amount) === tier.amount;
                      return (
                        <button
                          key={tier.amount}
                          type="button"
                          onClick={() => setAmount(String(tier.amount))}
                          disabled={isLoading}
                          className={`rounded-2xl p-2.5 sm:p-3 border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-600/20 border-red-500 text-white"
                              : "bg-zinc-950 border-white/10 hover:border-white/25 text-zinc-300"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-[11px] sm:text-xs font-medium text-zinc-400">
                              {tier.label}
                            </span>
                            <span className="self-start sm:self-auto text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-base sm:text-lg font-extrabold text-white mt-1">
                            ${tier.amount}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name (or @handle)"
                      value={supporterName}
                      onChange={(e) => setSupporterName(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/15 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Fan Message
                    </label>
                    <input
                      type="text"
                      placeholder="Say something nice to support their work..."
                      value={supporterMessage}
                      onChange={(e) => setSupporterMessage(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/15 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Custom Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter amount (e.g. 25)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-xl bg-zinc-950 border border-white/15 pl-8 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    disabled={isLoading || !amount}
                    onClick={() => startCheckout(Number(amount))}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-500 text-white py-3.5 font-bold text-sm sm:text-base transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting to Stripe...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-white" />
                        <span>
                          Support with {amount ? `$${amount}` : "a Coke"}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Instant One-Click Pay Buttons */}
                  <div className="pt-2">
                    <p className="text-[11px] text-zinc-500 text-center mb-2">
                      Or instant 1-click checkout:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => startCheckout(amt)}
                          disabled={isLoading}
                          className="rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 py-2 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Pay ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Encrypted & processed securely via Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Username;
