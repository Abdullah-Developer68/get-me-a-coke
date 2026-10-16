"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Send,
  ArrowRight,
} from "lucide-react";

const Signup = () => {
  const router = useRouter();
  const [otpButton, setOtpButton] = useState("Send OTP");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [showPassBox, setShowPassBox] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!receiverEmail) {
      toast.error("Please enter your email first");
      return;
    }
    toast("Sending OTP...");
    setOtpButton("Sending...");

    const res = await fetch("/api/auth/localAuth/genOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "", receiverEmail }),
    });

    if (res.ok) {
      toast.success("OTP sent to your email!");
      setOtpButton("Resend");
      setShowOtpBox(true);
    } else {
      toast.error("Error sending OTP");
      setOtpButton("Resend");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    const res = await fetch("/api/auth/localAuth/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: receiverEmail, otp }),
    });

    if (res.ok) {
      toast.success("OTP verified! Please choose a secure password.");
      setIsOtpVerified(true);
      setShowPassBox(true);
      setShowOtpBox(false);
    } else {
      toast.error("OTP verification failed. Please try again!");
    }
  };

  const localSignup = async (e) => {
    e.preventDefault();
    if (password.length < 8 || password.includes(" ")) {
      toast.error(
        "Password must be at least 8 characters long and cannot contain spaces."
      );
      return;
    }

    if (!isOtpVerified) {
      toast.error("Please verify your OTP first.");
      return;
    }

    const result = await signIn("credentials", {
      email: receiverEmail,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Sign in failed: " + result.error);
    } else {
      toast.success("Sign up successful! Redirecting to dashboard...");
      router.push("/dashboard");
    }
  };

  const googleSignUp = () => {
    localStorage.setItem("googleLogin", "true");
    toast("Signing you in ...");
    signIn("google");
  };

  const isReadyToSubmit =
    isOtpVerified && password.length >= 8 && !password.includes(" ");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="relative w-full max-w-md">
        <Card className="relative w-full rounded-3xl bg-zinc-900 border border-white/15 shadow-2xl text-white">
          <CardHeader className="space-y-3 pb-2 text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600 p-0.5">
              <Image
                src="/logo.jpg"
                alt="Get Me A Coke"
                width={44}
                height={44}
                className="rounded-[14px] object-cover w-full h-full"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-extrabold tracking-tight text-white">
                Create your creator account
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-1">
                Verify your email with OTP or sign up with 1 click
              </CardDescription>
            </div>

            {/* Step Indicator Pills */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold">
              <span
                className={`px-2.5 py-1 rounded-full border ${
                  !showOtpBox && !isOtpVerified
                    ? "bg-red-500/15 border-red-500/40 text-red-300"
                    : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                }`}
              >
                1. Email
              </span>
              <span className="text-zinc-600">→</span>
              <span
                className={`px-2.5 py-1 rounded-full border ${
                  showOtpBox
                    ? "bg-red-500/15 border-red-500/40 text-red-300"
                    : isOtpVerified
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                    : "bg-zinc-800 border-white/10 text-zinc-500"
                }`}
              >
                2. OTP
              </span>
              <span className="text-zinc-600">→</span>
              <span
                className={`px-2.5 py-1 rounded-full border ${
                  showPassBox
                    ? "bg-red-500/15 border-red-500/40 text-red-300"
                    : "bg-zinc-800 border-white/10 text-zinc-500"
                }`}
              >
                3. Password
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={localSignup} className="space-y-5">
              {/* Step 1: Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-zinc-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Email Address
                </Label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      disabled={isOtpVerified}
                      className="pl-10 h-11 rounded-xl bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40 focus-visible:border-red-500"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={sendOTP}
                    disabled={isOtpVerified || otpButton === "Sending..."}
                    className="h-11 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-white/15 font-semibold cursor-pointer shrink-0"
                  >
                    {isOtpVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{otpButton}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Step 2: OTP Verification */}
              {showOtpBox && (
                <div className="rounded-2xl bg-zinc-950 border border-red-500/30 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="otp"
                      className="text-zinc-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-400" />
                      Enter 6-Digit OTP
                    </Label>
                    <span className="text-[11px] text-zinc-400">
                      Check your inbox
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <InputOTP
                      id="otp"
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    type="button"
                    className="w-full h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer"
                    onClick={verifyOTP}
                    disabled={!otp || otp.length !== 6}
                  >
                    {isOtpVerified ? "✓ Verified" : "Verify OTP Code"}
                  </Button>
                </div>
              )}

              {/* Step 3: Password */}
              {showPassBox && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-zinc-300 text-xs font-semibold uppercase tracking-wider"
                    >
                      Create Password
                    </Label>
                    <span className="text-[11px] text-zinc-400">
                      Min. 8 characters, no spaces
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Choose a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40 focus-visible:border-red-500"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer"
                disabled={!isReadyToSubmit}
              >
                {!isReadyToSubmit ? (
                  "Complete Verification Above"
                ) : (
                  <>
                    Complete Sign Up
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-3 text-zinc-500 font-medium">
                  Or instant sign up with
                </span>
              </div>
            </div>

            {/* Social Signup */}
            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl bg-zinc-950 hover:bg-zinc-800 border-white/15 text-zinc-200 hover:text-white cursor-pointer flex items-center justify-center gap-2.5"
                onClick={googleSignUp}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/10 pt-5">
            <p className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-red-400 hover:text-red-300 underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
