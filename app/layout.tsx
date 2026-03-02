import type { Metadata } from "next";
import "./globals.css";
import { getCurrentProfile } from "@/lib/auth";
import HeaderNav from "@/components/HeaderNav";
import { AuthProvider } from "@/lib/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "LocalHub",
  description: "Your local community workspace",
  icons: { icon: "/images/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f5f5] text-gray-900 text-[16px]">
        {/* Top nav */}
        <header className="sticky top-0 z-40 bg-white border-b border-[#42dfe1]/40 h-12 flex items-center px-4">
          <div className="w-full max-w-7xl mx-auto flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo.png"
                alt="LocalHub"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Search */}
            <Suspense
              fallback={
                <div className="hidden sm:flex flex-1 max-w-md">
                  <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse" />
                </div>
              }
            >
              <SearchBar />
            </Suspense>

            <div className="ml-auto">
              <HeaderNav />
            </div>
          </div>
        </header>

        <div className="w-full max-w-7xl mx-auto px-4">
          <AuthProvider initialProfile={profile}>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
