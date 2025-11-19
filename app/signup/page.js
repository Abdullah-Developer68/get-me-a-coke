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
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Signup = () => {
  // router
  const router = useRouter();
  // states
  const [otpButton, setOtpButton] = useState("Send OTP");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [showPassBox, setShowPassBox] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const sendOTP = async (e) => {
    // prevent default behaviour
    e.preventDefault();
    // verify email exists
    if (!receiverEmail) {
      alert("Please enter your email first");
      return;
    }
    setOtpButton("Sending...");

    // send OTP request
    const res = await fetch("/api/auth/localAuth/genOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "", receiverEmail }),
    });
    // handle response
    if (res.ok) {
      alert("OTP has been sent");
      setOtpButton("Resend OTP");
      setShowOtpBox(true);
    } else {
      alert("Error sending OTP");
      setOtpButton("Resend OTP");
    }
  };

  // otp verification
  const verifyOTP = async (e) => {
    e.preventDefault(); // this is done because by default the form submission refreshes the page
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    // send request
    const res = await fetch("/api/auth/localAuth/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: receiverEmail, otp }),
    });

    if (res.ok) {
      alert("OTP verified please choose a secure password!");
      setIsOtpVerified(true);
      setShowPassBox(true);
      // keep OTP box hidden after success
      setShowOtpBox(false);
    } else {
      alert("OTP verification failed. Please try again!");
    }
  };

  // for final signup after OTP verified and password valid
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

    // Sign in using NextAuth credentials provider
    const result = await signIn("credentials", {
      email: receiverEmail,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      alert("Sign in failed: " + result.error);
    } else {
      alert("Sign up successful! Logging you in...");
      // Successfully signed in with session created
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm bg-black">
          <CardHeader>
            <CardTitle className="text-white">Sign up your account</CardTitle>
            <CardDescription>
              Enter your email below to create a new account
            </CardDescription>
            <CardAction>
              <Button variant="link" className="text-white">
                <Link href="/login">Login</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6 text-white">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      required
                    />
                    <Button
                      variant="link"
                      className="text-black bg-white w-24"
                      onClick={(e) => sendOTP(e)}
                    >
                      {otpButton}
                    </Button>
                  </div>
                </div>

                {/* OTP */}
                <div className={`gap-2 ${showOtpBox ? "grid" : "hidden"}`}>
                  <Label htmlFor="otp">Enter OTP</Label>
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
                      variant="default"
                      className="w-32"
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
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
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
                        required
                      />
                      {/* No separate save button; password saved on Sign up */}
                    </div>
                  </>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
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
                className="w-full rounded-md cursor-pointer"
                onClick={() => signIn("github")}
              >
                Sign up with Github
              </Button>
              <Image
                src="/github.png"
                width={30}
                height={30}
                className="rounded-full absolute right-18"
                alt="Github Logo"
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Signup;
