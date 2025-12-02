/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { tellToFetchData } from "@/redux/slices/userSlice";
import { fetchUpdatedUserInfo } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

const Username = () => {
  // This is used to extract the URL parameters and a route/page can accept url paramters if the file is made using [filename]
  // useParamas has change in Next.js 15 check docs for more info.
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

  const [profile, setProfile] = useState("/profilePic.png");
  const [cover, setCover] = useState("/coverImage.jpg");
  const [tagline, setTagline] = useState(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo
        ? JSON.parse(userInfo).tagline || "Check out my content!"
        : "Check out my content!";
    } catch {
      return "Check out my content!";
    }
  });

  // Initialize localStorage values on client side only
  useEffect(() => {
    const cachedProfile = localStorage.getItem("profilePic");
    const cachedCover = localStorage.getItem("coverPic");

    // Only use cached values if they are valid (not null, undefined, or empty strings)
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

    // Set the profile URL on client side
    setProfileUrl(window.location.href);
  }, []);

  const fetchUserInfo = async (username) => {
    const res = await fetchUpdatedUserInfo(username);
    if (res) {
      // tell the isFetch to disbable for the next time until the profile is updated again
      dispatch(tellToFetchData(false));
      const profilePic = res.profilePic || "/profilePic.png";
      const coverPic = res.coverPic || "/coverImage.jpg";
      const userTagline = res.tagline || "Check out my content!";
      setProfile(profilePic);
      setCover(coverPic);
      setTagline(userTagline);
      // Save data on localStorage for later use without extra fetches
      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("coverPic", coverPic);
    } else {
      return;
    }
  };

  // This gets the user info whenever the username in the url changes
  useEffect(() => {
    // If the URL username matches the logged-in user's username, use userInfo instead of fetching
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
      // Only fetch if it's a different creator's page
      fetchUserInfo(username);
    }
  }, [username, userInfo]);

  // This sends a req to the checkout api route for donating money via stripe
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
          email: userInfo.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create session");

      if (data?.url) {
        // stripe returns a url for its checkout page and we are redirecting to it.
        // For performance we often use useNavigate hook but this is an external page and not a part of the application so for this full browser navigation is required.
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getRecentPaymentInfo = useCallback(async () => {
    // GET requests shouldn't have a body. Send username as a query param instead.
    const res = await fetch(
      `/api/payment?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    setPayData(Array.isArray(data) ? data : []);
    // log the response data (not the state variable immediately after setState)
    // console.log("Recent payment info:", data);
  }, [username]);

  const getStats = useCallback(async () => {
    const res = await fetch(
      `/api/payment/stats?username=${encodeURIComponent(username)}`
    );
    const data = await res.json();
    // console.log("Payment stats:", data);

    setTotalAmount(data?.totalAmount || 0);
    setAverageAmount(data?.averageAmount || 0);
    setUniqueSupporters(data?.uniqueSupporters || 0);
    setTopSupporters(data?.topSupporters || []);
    setTotalDonations(data?.count || 0);
  }, [username]);

  useEffect(() => {
    getRecentPaymentInfo();
    getStats();
  }, [getRecentPaymentInfo, getStats]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Coke Url copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <ProtectedRoute>
        <div className="flex flex-col items-center w-full mt-0 pt-0">
          <div className="flex flex-col items-center relative w-full mt-0 pt-0 min-h-[400px] sm:min-h-[500px] md:min-h-[608px]">
            <div
              className="cover relative w-full overflow-hidden rounded-b-2xl bg-gray-900/60 h-[250px] sm:h-[350px] md:h-[480px]"
              aria-busy={isSessionLoading}
            >
              {cover ? (
                // Width and Height attributes don't apply these. They just inform Next.js to optimize the image for this size
                <Image
                  src={cover}
                  alt="cover page"
                  width={1920}
                  height={480}
                  priority
                  className="w-full h-full object-cover object-center block"
                  sizes="100vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 animate-pulse" />
              )}
            </div>
            <div className="profilePic absolute flex flex-col -bottom-28 sm:-bottom-24 md:-bottom-22 text-white justify-center items-center gap-2">
              {profile ? (
                <Image
                  src={profile}
                  alt="profile pic"
                  width={128}
                  height={128}
                  priority
                  sizes="128px"
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-gray-900"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-700 animate-pulse" />
              )}
              <span className="flex flex-col gap-1 sm:gap-2 items-center justify-center text-center px-4">
                <p className="text-lg sm:text-xl font-semibold">{username}</p>
                <p className="text-sm sm:text-base text-gray-300">
                  {isSessionLoading ? "Loading profile..." : tagline}
                </p>

                <span className="flex flex-wrap gap-1 sm:gap-2 justify-center items-center text-xs sm:text-sm">
                  <p>{totalDonations} Donations</p>
                  <span className="hidden sm:inline">·</span>
                  <p>{uniqueSupporters} supporters</p>
                  <span className="hidden sm:inline">·</span>
                  <p>${totalAmount / 100}/release</p>
                </span>
              </span>
              <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border border-gray-600/50 shadow-lg max-w-[90vw]">
                <span className="text-sm">🔗</span>
                <span className="text-gray-300 text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                  {profileUrl}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-all duration-200 border border-gray-500/50 hover:border-gray-400/50"
                  title={copied ? "Copied!" : "Copy link"}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/*  supporters and make payments */}
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 sm:gap-6 mt-36 sm:mt-40 md:mt-44 mb-10 w-[95%] sm:w-[90%] md:w-4/5 max-w-5xl text-white px-2 sm:px-0">
            {/* Left Column: Supporters & Donations */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              {/* Top 3 Supporters */}
              <div className="w-full rounded-lg bg-gray-900/70 border border-gray-700 p-4 sm:p-5 min-h-[150px]">
                <h3 className="text-base sm:text-lg font-semibold mb-4">
                  Top 3 Supporters
                </h3>
                {topSupporters.length > 0 ? (
                  <ul className="space-y-3 text-gray-200 text-sm">
                    {/* Loop over to display the Top supporters */}
                    {topSupporters.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-ful text-xs shrink-0">
                          {idx === 0 ? (
                            <Image
                              src="/medal-1.png"
                              alt="1st place medal"
                              width={24}
                              height={24}
                              className="h-5 w-5 sm:h-6 sm:w-6"
                            />
                          ) : idx === 1 ? (
                            <Image
                              src="/medal-2.png"
                              alt="2nd place medal"
                              width={24}
                              height={24}
                              className="h-5 w-5 sm:h-6 sm:w-6"
                            />
                          ) : (
                            <Image
                              src="/medal-3.png"
                              alt="3rd place medal"
                              width={24}
                              height={24}
                              className="h-5 w-5 sm:h-6 sm:w-6"
                            />
                          )}
                        </span>

                        <span className="break-words">
                          {s.name} with {s.totalAmount / 100}$ donations!
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                    <span className="text-3xl mb-2">🏆</span>
                    <p className="text-sm text-center">No supporters yet</p>
                    <p className="text-xs text-gray-600 text-center">
                      Be the first to support!
                    </p>
                  </div>
                )}
              </div>

              {/* Recent Donations */}
              <div className="w-full rounded-lg bg-gray-900/70 border border-gray-700 p-4 sm:p-5 min-h-[150px]">
                <h3 className="text-base sm:text-lg font-semibold mb-4">
                  Recent Donations
                </h3>
                {payData.length > 0 ? (
                  <ul className="space-y-3 text-gray-200 text-sm">
                    {/* Loop over to display the most recent supporters */}
                    {payData.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-base leading-none pointer-events-none select-none"
                          aria-hidden="true"
                        >
                          🥤
                        </span>
                        <span className="break-words">
                          <span className="font-medium">{s.name}</span> donated
                          <span className="font-semibold">
                            {" "}
                            {/* amount is in cents so convert it to dollars */}
                            {s.amount / 100} $
                          </span>{" "}
                          with a message &quot;{s.message}&quot;
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                    <span className="text-3xl mb-2">🥤</span>
                    <p className="text-sm text-center">No donations yet</p>
                    <p className="text-xs text-gray-600 text-center">
                      Be the first to buy a coke!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Make a Payment */}
            <div className="w-full md:w-1/2 rounded-lg bg-gray-900/70 border border-gray-700 p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Make a Payment
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="text"
                  placeholder="Enter Message"
                  value={supporterMessage}
                  onChange={(e) => setSupporterMessage(e.target.value)}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                  disabled={isLoading || !amount}
                  onClick={() => startCheckout(Number(amount))}
                  className="w-full rounded-md bg-linear-to-r from-gray-400 to-gray-600 text-black py-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Pay"}
                </button>
                <div className="flex gap-2">
                  {[10, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => startCheckout(amt)}
                      disabled={isLoading}
                      className="rounded-md bg-gray-800 border border-gray-700 px-3 py-1 text-xs text-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Pay {amt}$
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default Username;
