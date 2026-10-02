import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemedToaster } from "@/components/providers/ThemedToaster";
import { AudioRuntime } from "@/components/audio/AudioRuntime";
import { AudioCreditsModal } from "@/components/music/AudioCreditsModal";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ModeProvider } from "@/components/providers/ModeProvider";
import { SessionBootstrap } from "@/components/providers/SessionBootstrap";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { TopBar } from "@/components/layout/TopBar";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/links";
import { Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { CatCard } from "@/components/ui/CatLoader";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: Cozy Browser Arcade`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "browser games",
    "cozy games",
    "lofi",
    "2048",
    "wordle",
    "connect 4",
    "tic tac toe",
    "slide puzzle",
    "color memory",
    "free online games",
  ],
  authors: [{ name: "Aman Shaikh", url: "https://github.com/ShaikhAman01" }],
  creator: "Aman Shaikh",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME}: Cozy Browser Arcade`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}: Cozy Browser Arcade`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
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
            __html: `try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');var l=document.createElement('link');l.rel='preload';l.as='image';l.href=(location.pathname.indexOf('/game/')===0?'/scene-game/':'/scene/')+t+'/base.webp';document.head.appendChild(l);}catch(e){}`,
          }}
        />
        {/* First-load splash: shown only if loading passes 600 ms, cleared once
            fonts, visible images and the scene painting are in, never past 8 s. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement,done=false,shownAt=0;function hide(){d.setAttribute('data-pp-splash','done')}function finish(){if(done)return;done=true;clearTimeout(s);var left=shownAt?500-(Date.now()-shownAt):0;left>0?setTimeout(hide,left):hide()}var s=setTimeout(function(){shownAt=Date.now();d.setAttribute('data-pp-splash','show')},600);setTimeout(finish,8000);function wait(src){return new Promise(function(r){var i=new Image();i.onload=i.onerror=r;i.src=src})}function check(){var w=[].slice.call(document.images).filter(function(i){return i.loading!=='lazy'&&!i.complete&&i.getClientRects().length}).map(function(i){return new Promise(function(r){i.addEventListener('load',r);i.addEventListener('error',r)})});[].slice.call(document.querySelectorAll('.scene-base,.scene-base-game')).forEach(function(el){var m=/url\\(["']?([^"')]+)/.exec(getComputedStyle(el).backgroundImage);if(m)w.push(wait(m[1]))});if(document.fonts)w.push(document.fonts.ready);Promise.all(w).then(finish,finish)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check);else check()})()`,
          }}
        />
        {/* Entrance for the static pages, which stay server components so they
            can export metadata. Replaces their Framer Motion wrapper. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@keyframes pp-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.pp-rise{animation:pp-rise .35s ease-out both}@media (prefers-reduced-motion:reduce){.pp-rise{animation:none}}`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${pixelFont.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only bg-slate-900 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
        >
          Skip to content
        </a>
        <div
          role="status"
          aria-live="polite"
          className="pp-splash fixed inset-0 z-[200] flex items-center justify-center bg-[var(--background)]"
        >
          <CatCard label="Loading" large />
        </div>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
