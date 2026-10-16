import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "sonner/dist/styles.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
// The following are not directly used in here because they
// need to be client side and the metadata in here needs to be server side, so mixing them will cause an error
import SessionWrapper from "@/providers/SessionWrapper";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get Me A Coke — Fuel Creators With Refreshing Support",
  description:
    "Support your favorite creators, developers, and artists by buying them an ice-cold Coke.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-zinc-100 flex flex-col min-h-screen`}
      >
        <SessionWrapper>
          <AuthProvider>
            <ReduxProvider>
              <Navbar />

              <main className="relative flex-1 overflow-x-hidden bg-[#09090b]">
                {children}
              </main>

              <Footer />
              <Toaster
                position="top-center"
                richColors
                theme="dark"
                offset="80px"
                style={{ zIndex: 999999 }}
              />
            </ReduxProvider>
          </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
