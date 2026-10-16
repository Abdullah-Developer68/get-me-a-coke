"use client";
import Image from "next/image";
import Link from "next/link";
import CreatorSearch from "@/components/CreatorSearch";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Flame,
  Sparkles,
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
    gif: "/man.gif",
    icon: HeartHandshake,
    badge: "Community First",
  },
  {
    title: "Fans want to contribute",
    subtitle: "Frictionless Stripe checkout",
    description:
      "Turn appreciation into sustainable income in seconds. Supporters pick a Coke tier, leave a message, and fund your next big idea.",
    gif: "/coin.gif",
    icon: Coins,
    badge: "Instant Support",
  },
  {
    title: "Fans want to collaborate",
    subtitle: "Build your inner circle",
    description:
      "Recognize your top supporters on your public leaderboard, celebrate every milestone, and turn casual viewers into superfans.",
    gif: "/group.gif",
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
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center">
          {/* Top Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/25 px-4 py-1.5 text-xs sm:text-sm font-medium text-red-300 mb-6">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            <span>The Refreshing Way to Fund Creative Work</span>
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
                🥤 $10
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl leading-[1.08]">
            Buy Me A <span className="text-red-500">Coke!</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Give your audience an effortless, fun way to fund your projects.
            Share your page, receive one-tap Stripe support, and celebrate your
            top fans in real time.
          </p>

          {/* Interactive Search Component */}
          <CreatorSearch />

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={userInfo?.username ? `/${userInfo.username}` : "/signup"}
            >
              <button className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors duration-200 cursor-pointer">
                <span>
                  {userInfo?.username
                    ? "View Your Creator Page"
                    : "Start Your Free Page"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-medium text-zinc-200 transition-colors duration-200 cursor-pointer">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span>Customize Dashboard</span>
              </button>
            </Link>
          </div>

          {/* Trust & Feature Badges */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-12 max-w-xl w-full text-center">
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">
                60 sec
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Page Setup</p>
            </div>
            <div className="border-x border-white/10 px-2">
              <p className="text-xl sm:text-2xl font-extrabold text-red-500">
                1-Click
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Stripe Checkout</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">
                Live
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Fan Leaderboards</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CREATORS SECTION */}
      <section className="relative py-16 border-t border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Creator Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Creators on Get Me A Coke
              </h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-md">
              Explore how top creators use their custom profile pages to collect
              fan messages and donations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_CREATORS.map((creator) => (
              <Link
                key={creator.username}
                href={`/${creator.username}`}
                className="group relative rounded-2xl bg-zinc-900 hover:bg-zinc-900/80 border border-white/10 hover:border-red-500/50 p-6 transition-all duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/15 group-hover:border-red-500 transition-colors"
                        unoptimized
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                          {creator.name}
                        </h3>
                        <p className="text-xs font-medium text-zinc-400">
                          @{creator.username}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[11px] font-medium text-red-300">
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
                  <span className="text-zinc-400">
                    🥤{" "}
                    <strong className="text-zinc-200">
                      {creator.supporters}
                    </strong>{" "}
                    supporters
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
      <section className="relative py-20 md:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-white/10 px-3.5 py-1 text-xs font-semibold text-zinc-300 mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Built for Creator Momentum
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Fans Can Buy You a Coke
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Everything you need to turn audience gratitude into recurring
              creative fuel—without complex tiers or paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {VALUE_PILLARS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative group rounded-2xl bg-zinc-900 hover:bg-zinc-900/80 border border-white/10 hover:border-red-500/40 p-7 transition-colors duration-200"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 p-2.5">
                        <Image
                          src={item.gif}
                          alt={item.title}
                          width={56}
                          height={56}
                          className="rounded-xl w-full h-full object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
                        <Icon className="w-3.5 h-3.5 text-red-400" />
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-zinc-900 p-8 sm:p-12 md:p-14 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to receive your first Coke?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                Claim your custom creator link, upload your cover art, and start
                collecting fan support with real-time leaderboards.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Custom creator URL
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Top 3 supporter medals
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Stripe-grade security
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link href={userInfo ? "/dashboard" : "/signup"}>
                <button className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 text-sm sm:text-base font-bold transition-colors cursor-pointer">
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
