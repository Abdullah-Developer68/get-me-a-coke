"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
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
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
        <Card className="w-full max-w-sm bg-zinc-900 border border-white/15 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold">
              Login to your account
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" className="text-red-400 hover:text-red-300 p-0 text-sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCredentialsLogin}>
              <div className="flex flex-col gap-5 text-white">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-zinc-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40"
                    required
                  />
                </div>
                <div className="grid gap-2">
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
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-950 border-white/15 text-white placeholder:text-zinc-500 focus-visible:ring-red-500/40"
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2.5">
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer"
              onClick={handleCredentialsLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="flex items-center justify-center gap-2 w-full relative">
              <Button
                variant="outline"
                className="w-full rounded-md cursor-pointer border-white/15 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 hover:text-white"
                onClick={githubLogin}
              >
                Login with Github
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
                onClick={googleLogin}
              >
                Login with Google
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

export default Login;
