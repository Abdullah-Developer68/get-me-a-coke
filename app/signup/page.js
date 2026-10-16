"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
    toast("Sending OTP...");

    if (!receiverEmail) {
      alert("Please enter your email first");
      return;
    }
    setOtpButton("Sending OTP...");
    const res = await fetch("/api/auth/localAuth/genOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "", receiverEmail }),
    });
    if (res.ok) {
      alert("OTP has been sent");
      setOtpButton("Resend OTP");
      setShowOtpBox(true);
    } else {
      alert("Error sending OTP");
      setOtpButton("Resend OTP");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      alert("Please enter a valid 6-digit OTP");
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
      const data = await res.json().catch(() => ({}));
      if (data.message && data.message !== "OTP verified successfully.") {
        alert(data.message);
        return;
      }
      alert("OTP verified please choose a secure password!");
      setIsOtpVerified(true);
      setShowPassBox(true);
      setShowOtpBox(false);
    } else {
      alert("Verification failed. Please try again!");
    }
  };

  const localSignup = async (e) => {
    e.preventDefault();
    if (password.length < 8 || password.includes(" ")) {
      alert(
        "Password must be at least 8 characters long and cannot contain spaces."
      );
      return;
    }

    if (!isOtpVerified) {
      alert("Please verify your OTP first.");
      return;
    }

    const result = await signIn("credentials", {
      email: receiverEmail,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      alert("Sign in failed: " + result.error);
    } else {
      alert("Sign up successful! Logging you in...");
      router.push("/dashboard");
    }
  };

  const githubSignUp = () => {
    localStorage.setItem("githubLogin", "true");
    toast("Signing you in ...");
    signIn("github");
  };

  const googleSignUp = () => {
    localStorage.setItem("googleLogin", "true");
    toast("Signing you in ...");
    signIn("google");
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
        <Card className="w-full max-w-sm bg-zinc-900 border border-white/15 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold">Sign up your account</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Enter your email below to create a new account
            </CardDescription>
            <CardAction>
              <Button variant="link" className="text-red-400 hover:text-red-300 p-0 text-sm">
                <Link href="/login">Login</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6 text-white">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-zinc-300">
                    Email
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      className="bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40"
                      required
                    />
                    <Button
                      type="button"
                      variant="link"
                      className="text-black bg-white hover:bg-zinc-200 w-24 cursor-pointer text-xs font-medium"
                      onClick={(e) => sendOTP(e)}
                    >
                      {otpButton}
                    </Button>
                  </div>
                </div>

                {/* OTP */}
                <div className={`gap-2 ${showOtpBox ? "grid" : "hidden"}`}>
                  <Label htmlFor="otp" className="text-xs font-semibold text-zinc-300">
                    Enter OTP
                  </Label>
                  <div className="flex justify-center mt-2">
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
                  <div className="flex justify-center mt-2">
                    <Button
                      type="button"
                      className="w-32 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 cursor-pointer"
                      onClick={verifyOTP}
                      disabled={!otp || otp.length !== 6}
                    >
                      {isOtpVerified ? "✓ Verified" : "Verify OTP"}
                    </Button>
                  </div>
                </div>

                {/* Password */}
                {showPassBox && (
                  <>
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-xs font-semibold text-zinc-300">
                        Password
                      </Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-xs text-red-400 hover:text-red-300 underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2.5">
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer"
              onClick={localSignup}
              disabled={
                !isOtpVerified || password.length < 8 || password.includes(" ")
              }
            >
              {!isOtpVerified || password.length < 8 || password.includes(" ")
                ? "Complete Steps Above"
                : "Sign up"}
            </Button>
            <div className="flex items-center justify-center gap-2 w-full relative">
              <Button
                variant="outline"
                className="w-full rounded-md cursor-pointer border-white/15 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 hover:text-white"
                onClick={githubSignUp}
              >
                Sign up with Github
              </Button>
              <Image
                src="/github.png"
                width={24}
                height={24}
                className="rounded-full absolute right-4 pointer-events-none"
                alt="Github Logo"
              />
            </div>
            <div className="flex items-center justify-center gap-2 w-full relative">
              <Button
                variant="outline"
                className="w-full rounded-md cursor-pointer border-white/15 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 hover:text-white"
                onClick={googleSignUp}
              >
                Sign up with Google
              </Button>
              <svg
                className="absolute right-4 pointer-events-none"
                width="20"
                height="20"
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
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Signup;
