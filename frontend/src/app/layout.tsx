import type { Metadata } from "next";
import { ThemedToaster } from "@/components/providers/ThemedToaster";
import { AudioRuntime } from "@/components/audio/AudioRuntime";
import { AudioCreditsModal } from "@/components/music/AudioCreditsModal";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ModeProvider } from "@/components/providers/ModeProvider";
import { SessionBootstrap } from "@/components/providers/SessionBootstrap";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { TopBar } from "@/components/layout/TopBar";
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
      <head>
        {/* Must run before first paint, or dark-mode users get a light frame.
            Preloads in JS, not a <link media>, because a saved theme beats the
            OS preference and only this script knows which won. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');var l=document.createElement('link');l.rel='preload';l.as='image';l.href='/scene/'+t+'/base.webp';document.head.appendChild(l);}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${pixelFont.variable} antialiased`}>
        <ThemeProvider>
          <ModeProvider>
            <MotionProvider>
              <SessionBootstrap />
              <TopBar />
              {children}
              <AudioRuntime />
              <AudioCreditsModal />

              <ThemedToaster />
            </MotionProvider>
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}