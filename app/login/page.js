"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast("Logging in...");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful");
        router.replace("/");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const githubLogin = () => {
    localStorage.setItem("githubLogin", "true");
    toast("Logging you in ...");
    signIn("github");
  };

  const googleLogin = () => {
    localStorage.setItem("googleLogin", "true");
    toast("Logging you in ...");
    signIn("google");
  };

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
                Welcome back
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-1">
                Sign in to manage your creator page & support
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-zinc-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40 focus-visible:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-zinc-300 text-xs font-semibold uppercase tracking-wider"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-red-400 hover:text-red-300 underline-offset-4 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40 focus-visible:border-red-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Sign In
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
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl bg-zinc-950 hover:bg-zinc-800 border-white/15 text-zinc-200 hover:text-white cursor-pointer flex items-center justify-center gap-2.5"
                onClick={githubLogin}
              >
                <Image
                  src="/github.png"
                  width={20}
                  height={20}
                  className="rounded-full"
                  alt="GitHub"
                />
                <span>GitHub</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl bg-zinc-950 hover:bg-zinc-800 border-white/15 text-zinc-200 hover:text-white cursor-pointer flex items-center justify-center gap-2.5"
                onClick={googleLogin}
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
                <span>Google</span>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/10 pt-5">
            <p className="text-sm text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-red-400 hover:text-red-300 underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
