import type {
  Metadata,
} from "next";

import {
  Inter,
  Pixelify_Sans,
} from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],

  variable:
    "--font-inter",
});

const pixelFont =
  Pixelify_Sans({
    subsets: ["latin"],

    variable:
      "--font-pixel",
  });

export const metadata: Metadata =
  {
    title:
      "PixelPlayground",

    description:
      "Cozy multiplayer mini games",
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${pixelFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}