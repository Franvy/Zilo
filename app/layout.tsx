import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zilo",
  icons: {
      icon: [
          { url: "/favicon.ico" },
          { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
          { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
          { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
          { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
  },
  description: "Zilo is a modern bookmark manager that lets you organize and access your favorite websites with ease. Unlike typical bookmark tools, Zilo supports custom global background colors, allowing seamless integration with Safari and your system theme."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
