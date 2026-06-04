import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AudioRuntime } from "@/components/audio/AudioRuntime";
import { AudioCreditsModal } from "@/components/music/AudioCreditsModal"; // Import your credits module
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Inter, Pixelify_Sans } from "next/font/google";
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
          
          {/* Running background systems and active view models */}
          <AudioRuntime />
          <AudioCreditsModal /> 
          
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}