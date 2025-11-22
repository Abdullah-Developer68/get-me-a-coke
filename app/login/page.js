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

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // React expects no side effects to run during rendering phase of the component, but can not can not stop us from doing this.
  // First the login page renders and user clicks the login with github, so an update to session was made
  // and on every update react will rerender the entire component now the issue is in the 2nd render phase we
  // are immediatly redirecting to dashboard which is a side effect and it will still work but react wants it
  // to happen after the login component finishes rendering so to avoid warnings we add the redirecting in useEffect
  // so that redirecting happens after the rendering of the login component has been finished because session is in
  // dependency array and rendering was caused due to its update.

  // If all of this is not done then in dev mode we risk double navigation but in production it will usually work fine
  useEffect(() => {
    if (session) {
      // used replace to prevent the user from going back to the login page using browser back button
      // .push will add the login page to the browser history, so user can go back
      router.replace("/");
    }
  }, [session, router]);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert("Login failed: " + result.error);
      } else {
        router.replace("/");
      }
    } catch (error) {
      alert("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm bg-black">
          <CardHeader>
            <CardTitle className="text-white">Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" className="text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCredentialsLogin}>
              <div className="flex flex-col gap-6 text-white">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={handleCredentialsLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="flex items-center justify-center gap-2 w-full relative">
              <Button
                variant="outline"
                className="w-full rounded-md cursor-pointer"
                onClick={() => signIn("github")}
              >
                Login with Github
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

export default Login;
