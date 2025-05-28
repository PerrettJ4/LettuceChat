"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/app/context/UserContext";
import { OnlineStatusProvider } from "@/app/context/OnlineStatusContext";
import { OnlineToggleSwitch } from "@/app/components/OnlineToggleSwitch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          <OnlineStatusProvider>
            <div className="page-container" style={{ paddingBottom: 50 }}>
              {children}
            </div>
            <OnlineToggleSwitch />
          </OnlineStatusProvider>
        </UserProvider>
      </body>
    </html>
  );
}
