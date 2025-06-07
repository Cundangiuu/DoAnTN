import { Modal } from "@/components/organisms";
import AppContext from "@/contexts";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tri Viet - IMS",
  description: "Tri Viet Website",
  other: {
    "zalo-platform-site-verification": "MDguAuhSBt88yhnLtu5dVbpntsAmZmWzC3C",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body id="body">
        <Suspense>
          <SessionProvider>
            <AppContext>
              <Toaster richColors />
              <Modal />
              {children}
            </AppContext>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
