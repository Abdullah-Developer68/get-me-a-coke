"use client";
import Image from "next/image";
import Link from "next/link";
import CreatorSearch from "@/components/CreatorSearch";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Flame,
  ArrowRight,
  HeartHandshake,
  Coins,
  Users,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const FEATURED_CREATORS = [
  {
    username: "mrbeast",
    name: "MrBeast",
    category: "Entertainment & Philanthropy",
    tagline: "Pushing the boundaries of creator entertainment & giving back.",
    avatar: "/mrbeast-profile.jpg",
    supporters: "14.2k",
    badge: "Top Creator",
  },
  {
    username: "chai-aur-code",
    name: "Chai aur Code",
    category: "Full-Stack Engineering",
    tagline: "Making software engineering accessible, practical, and fun.",
    avatar: "/chai-aur-code-profile.jpg",
    supporters: "8.9k",
    badge: "Tech Educator",
  },
  {
    username: "code-with-harry",
    name: "CodeWithHarry",
    category: "Programming & AI",
    tagline: "Helping millions of developers write their first line of code.",
    avatar: "/code-with-harry-profile.jpg",
    supporters: "11.4k",
    badge: "Trending",
  },
];

const VALUE_PILLARS = [
  {
    title: "Fans want to help",
    subtitle: "Direct, meaningful appreciation",
    description:
      "Give your audience an effortless way to say thank you for every tutorial, stream, open-source release, or video you ship.",
    icon: HeartHandshake,
    badge: "Community First",
  },
  {
    title: "Fans want to contribute",
    subtitle: "Frictionless Stripe checkout",
    description:
      "Turn appreciation into sustainable income in seconds. Supporters pick a Coke tier, leave a message, and fund your next big idea.",
    icon: Coins,
    badge: "Instant Support",
  },
  {
    title: "Fans want to collaborate",
    subtitle: "Build your inner circle",
    description:
      "Recognize your top supporters on your public leaderboard, celebrate every milestone, and turn casual viewers into superfans.",
    icon: Users,
    badge: "Superfan Leaderboard",
  },
];

export default function Home() {
  const { userInfo } = useAuth();

  useEffect(() => {
    if (
      userInfo &&
      (localStorage.getItem("googleLogin") === "true" ||
        localStorage.getItem("githubLogin") === "true" ||
        localStorage.getItem("loginSuccess") === "true")
    ) {
      toast.success("You have successfully logged in ...");
      localStorage.setItem("googleLogin", "false");
      localStorage.setItem("githubLogin", "false");
      localStorage.removeItem("loginSuccess");
    }

    if (localStorage.getItem("logoutSuccess") === "true") {
      toast.success("You have successfully logged out");
      localStorage.removeItem("logoutSuccess");
    }
  }, [userInfo]);

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center">
          {/* Top Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/25 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-sm font-medium text-red-300 mb-6 max-w-full">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500 shrink-0" />
            <span className="truncate">
              The Refreshing Way to Fund Creative Work
            </span>
          </div>

          {/* Mascot / Avatar Showcase */}
          <div className="relative mb-6 animate-float">
            <div className="relative rounded-full p-1.5 bg-zinc-900 border-2 border-red-500/40 shadow-2xl">
              <Image
                className="rounded-full h-24 w-24 sm:h-28 sm:w-28 object-cover bg-zinc-900"
                src="/burger-dance.gif"
                alt="Buy me a coke mascot"
                width={112}
                height={112}
                unoptimized
              />
              <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-lg ring-2 ring-[#09090b]">
                <Image
                  src="/logo.jpg"
                  alt="Coke"
                  width={14}
                  height={14}
                  className="rounded-full object-cover"
                />
                <span>$10</span>
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl leading-[1.1]">
            Buy Me A <span className="text-red-500">Coke!</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed px-1">
            Give your audience an effortless, fun way to fund your projects.
            Share your page, receive one-tap Stripe support, and celebrate your
            top fans in real time.
          </p>

          {/* Interactive Search Component */}
          <CreatorSearch />

          {/* Quick Action Buttons */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
            <Link
              href={userInfo?.username ? `/${userInfo.username}` : "/signup"}
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors duration-200 cursor-pointer">
                <span>{userInfo ? "View Your Page" : "Get Started Free"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/15 px-7 py-3.5 text-sm sm:text-base font-semibold text-zinc-200 hover:text-white transition-colors duration-200 cursor-pointer">
                <span>Creator Studio</span>
              </button>
            </Link>
          </div>

          {/* Micro Proof Stats */}
          <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-zinc-400 pt-7 sm:pt-8 border-t border-white/10 max-w-xl w-full">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>0% Platform Fees to Start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Stripe Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Custom Creator URL</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: POPULAR & FEATURED CREATORS */}
      <section className="relative py-14 sm:py-16 md:py-20 border-t border-white/10 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-1.5">
                <TrendingUp className="w-4 h-4" />
                Featured Creators
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Fueling Top Makers Everywhere
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors self-start sm:self-auto"
            >
              <span>Explore all creators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURED_CREATORS.map((creator) => (
              <Link
                key={creator.username}
                href={`/${creator.username}`}
                className="group relative rounded-2xl bg-zinc-900 hover:bg-zinc-900/80 border border-white/10 hover:border-red-500/40 p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover ring-2 ring-white/10 group-hover:ring-red-500/40 transition-colors shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-white group-hover:text-red-400 transition-colors truncate">
                          {creator.name}
                        </h3>
                        <p className="text-xs font-medium text-zinc-400 truncate">
                          @{creator.username}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[11px] font-medium text-red-300 shrink-0">
                      {creator.badge}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                    {creator.category}
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {creator.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Image
                      src="/logo.jpg"
                      alt="Coke"
                      width={14}
                      height={14}
                      className="rounded-full object-cover shrink-0"
                    />
                    <span>
                      <strong className="text-zinc-200">
                        {creator.supporters}
                      </strong>{" "}
                      supporters
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-red-400 group-hover:translate-x-1 transition-transform">
                    Buy a Coke
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: YOUR FANS CAN BUY YOU A COKE */}
      <section className="relative py-16 sm:py-20 md:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-white/10 px-3.5 py-1 text-xs font-semibold text-zinc-300 mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Built for Creator Momentum
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Your Fans Can Buy You a Coke
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Everything you need to turn audience gratitude into recurring
              creative fuel—without complex tiers or paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {VALUE_PILLARS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative group rounded-2xl bg-zinc-900 hover:bg-zinc-900/80 border border-white/10 hover:border-red-500/40 p-6 sm:p-7 transition-colors duration-200"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-5 sm:mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 text-white shadow-sm shrink-0">
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 border border-white/10 px-3 py-1 text-xs font-medium text-white">
                        <Icon className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={1.75} />
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
                      {item.subtitle}
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CALL TO ACTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-zinc-900 p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to receive your first Coke?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                Claim your custom creator link, upload your cover art, and start
                collecting fan support with real-time leaderboards.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Custom creator URL
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Top 3 supporter medals
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  Stripe-grade security
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href={userInfo ? "/dashboard" : "/signup"}
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 text-sm sm:text-base font-bold transition-colors cursor-pointer">
                  <span>{userInfo ? "Go to Dashboard" : "Claim Your Link"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
