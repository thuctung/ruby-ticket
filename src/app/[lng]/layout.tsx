import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
// @ts-ignore: CSS module declarations not found in this environment
import "../globals.css";
import ToastMessage from "@/components/ui/toast-message";
import { LoadingGlobal } from "@/components/ui/loading";
// @ts-ignore: CSS module declarations not found in this environment
import "react-datepicker/dist/react-datepicker.css";
import { Suspense } from "react";
import { dir } from "i18next";
import NextTopLoader from "nextjs-toploader";
import SplashRemover from "@/components/ui/SplashRemover";

import { body, mono } from "@/helpers/font-client";

export const metadata: Metadata = {
  title: "Ruby Travel",
  description: "Vé du lịch Đà Nẵng",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}>) {
  const { lng } = await params;
  return (
    <html lang={lng} dir={dir(lng)} className={`${body.variable} ${mono.variable}`}>
      <meta name="google-site-verification" content="SI9lUDpDSzVXJTFANBGfg32-6nUdgAh6t0LD-0axg8E" />
      <body className={body.className}>
        <NextTopLoader color="#0ea5e9" showSpinner={false} />
        <SplashRemover />
        <Suspense fallback={<SplashRemover />}>{children}</Suspense>
        <div id="modal-root"></div>
        <ToastMessage />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
