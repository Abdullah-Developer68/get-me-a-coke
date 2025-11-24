"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [userInfo, setuserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(session);

  // when ever a re-render happens the function is re-created with a new memory
  // address. If we know that we do not want a specific funtion to be created again
  // on every re-render we can freeze it using useCallback on recreate with only
  // when specific dependencies change. Here, since there are no dependencies the function will be created only once.
  const storeDataOnLogin = useCallback((userData) => {
    if (!userData) {
      setuserInfo(null);
      localStorage.removeItem("userInfo");
      return;
    }
    // update only if any of the fields have actually changed
    setuserInfo((prev) => {
      if (
        !prev ||
        prev.name !== userData.name ||
        prev.email !== userData.email ||
        prev.image !== userData.image ||
        prev.username !== userData.username ||
        prev.profilePic !== userData.profilePic ||
        prev.coverPic !== userData.coverPic
      ) {
        localStorage.setItem("userInfo", JSON.stringify(userData));
        return userData;
      }
      return prev;
    });
  }, []);

  const clearDataOnLogout = useCallback(() => {
    setuserInfo(null);
    localStorage.removeItem("userInfo");
  }, []);

  // when user refreshes the page
  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    console.log("Loading user data from local storage");
    const stored = localStorage.getItem("userInfo");

    if (stored) {
      try {
        setuserInfo(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("userInfo");
      }
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      storeDataOnLogin(session.user);
    }
    if (status === "unauthenticated") {
      clearDataOnLogout();
    }
  }, [status, session, storeDataOnLogin, clearDataOnLogout]);

  useEffect(() => {
    loadFromStorage();
    setIsLoading(false);
  }, [loadFromStorage]);

  return (
    <AuthContext.Provider
      value={{ userInfo, isLoading, status, clearDataOnLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
