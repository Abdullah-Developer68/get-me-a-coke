import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
// The following are not directly used in here because they
// need to be client side and the metadata in here needs to be server side, so mixing them will cause an error
import SessionWrapper from "@/providers/SessionWrapper";
import ReduxProvider from "@/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get-ME-A-Coke - Fund your projects with coke",
  description: "This website is a crowdfunding platform for creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <AuthProvider>
            <ReduxProvider>
              <Navbar />

              <div className="relative min-h-screen bg-black">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

                <div className="relative z-10">{children}</div>
              </div>

              <Footer />
            </ReduxProvider>
          </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
