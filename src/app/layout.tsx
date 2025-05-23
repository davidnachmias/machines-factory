import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Machines Management App",
  description: "An application to manage machines, faults, and maintenance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const buttons = [
    { text: "מכונות קיימות", href: "/" },
    { text: "הוספת מכונה", href: "/addMachine" },
    { text: "הוספת תקלה/טיפול תקופתי", href: "/addFault" },
    { text: "תקלות פתוחות", href: "/openFaults" },
    { text: "דוח השבתה ועלות", href: "/report" },
  ];
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex h-screen bg-gray-50" dir="rtl">
        <Sidebar buttons={buttons} />
        <div className="flex flex-col flex-1">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
