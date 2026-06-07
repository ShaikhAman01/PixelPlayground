import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AudioRuntime } from "@/components/audio/AudioRuntime";
import { AudioCreditsModal } from "@/components/music/AudioCreditsModal";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pixelFont = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "PixelPlayground",
  description: "Cozy singleplayer & multiplayer mini games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${pixelFont.variable} antialiased`}>
        <ThemeProvider>
          {children}

          <AudioRuntime />
          <AudioCreditsModal />

          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}