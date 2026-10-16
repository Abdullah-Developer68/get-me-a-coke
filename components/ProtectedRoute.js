import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isLoading, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && status === "unauthenticated") {
      router.push("/login");
    }
  }, [isLoading, status, router]);

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3 text-zinc-300">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl">
          <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
        </div>
        <p className="text-sm font-medium text-zinc-400 animate-pulse">
          Preparing your workspace...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return children;
};

export default ProtectedRoute;
