import type { Metadata } from "next";

import { Toaster } from "sonner";
import { AudioProvider } from "@/providers/AudioProvider";

import { Inter, Pixelify_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],

  variable: "--font-inter",
});

const pixelFont = Pixelify_Sans({
  subsets: ["latin"],

  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "PixelPlayground",

  description: "Cozy multiplayer mini games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pixelFont.variable}`}>
        <AudioProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Toaster richColors position="top-center" />
        </AudioProvider>
      </body>
    </html>
  );
}
