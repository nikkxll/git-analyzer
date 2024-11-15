import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const ethnocentricItalic = localFont({
  src: [
    {
      path: "./fonts/ethnocentric_rg_it.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ethnocentric",
});
const ethnocentric = localFont({
  src: [
    {
      path: "./fonts/ethnocentric_rg.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ethnocentric",
});
const audiowide = localFont({
  src: "./fonts/Audiowide-Regular.ttf",
  variable: "--font-audiowide",
  weight: "100 900",
});
const electrolize = localFont({
  src: "./fonts/Electrolize-Regular.ttf",
  variable: "--font-electrolize",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Code Review App",
  description: "GitHub Code Quality Review Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ethnocentricItalic.variable} ${ethnocentric.variable} ${audiowide.variable} ${electrolize.variable} antialiased min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900`}
      >
        {children}
      </body>
    </html>
  );
}
