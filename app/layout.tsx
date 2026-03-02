import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalHub",
  description: "Your local community workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f5f5] text-gray-900 text-[16px]">
        {/* Top nav — dev.to style */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-12 flex items-center px-4">
          <div className="w-full max-w-7xl mx-auto flex items-center gap-3">
            {/* Logo */}
            <a href="/" className="flex items-center shrink-0">
              <img
                src="/images/logo.png"
                alt="LocalHub"
                className="h-8 w-auto"
              />
            </a>

            {/* Search placeholder */}
            <div className="hidden sm:flex flex-1 max-w-md">
              <input
                type="text"
                readOnly
                placeholder="Search LocalHub…"
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-500 cursor-default focus:outline-none"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <a
                href="/login"
                className="text-sm text-gray-700 font-medium px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                Log in
              </a>
              <a
                href="/login"
                className="text-sm font-semibold px-3 py-1.5 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Create account
              </a>
            </div>
          </div>
        </header>

        <div className="w-full max-w-7xl mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}
