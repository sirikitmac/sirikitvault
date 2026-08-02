import type { Metadata } from "next";
import { League_Spartan, Montserrat } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = League_Spartan({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SirikitVault.dev — a curated design & dev vault",
  description:
    "Sirikit's personal library of UI/UX resources, design inspiration, components, animations, assets, and developer tools.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${GeistMono.variable} font-sans noise`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
