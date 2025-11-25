import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isLoading, status } = useAuth();
  const router = useRouter();

  // This is written in useEffect because intially the application is rendered and if navigation occurs during this
  // phase then there is a error that rendering was not completed due to navigation. Code will still work fine tough
  useEffect(() => {
    if (!isLoading && status === "unauthenticated") {
      router.push("/login");
    }
  }, [isLoading, status, router]);

  if (isLoading) {
    return (
      <>
        <div>Loading ...</div>
      </>
    );
  }

  if (status === "unauthenticated") {
    return null; // Don't render children while redirecting
  }

  return children;
};

export default ProtectedRoute;
