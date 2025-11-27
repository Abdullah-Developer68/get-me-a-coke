"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

const LoginSuccessToastContent = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "success") {
      toast.success("Login successful");
      // Optionally, clean the URL
      const url = new URL(window.location);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
};

const LoginSuccessToast = () => (
  <Suspense fallback={null}>
    <LoginSuccessToastContent />
  </Suspense>
);

export default LoginSuccessToast;
