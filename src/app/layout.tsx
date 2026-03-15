

import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastMessage from "@/components/ui/toast-message";
import { LoadingGlobal } from "@/components/ui/loading";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ruby Travel",
  description: "Vé du lịch Đà Nẵng",
  icons: {
    icon: "/favicon.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">{children}</body>
      <ToastMessage/>
      <LoadingGlobal/>
    </html>
  );
}
