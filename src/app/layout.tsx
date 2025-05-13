import type { Metadata } from "next";
import { Inter } from "next/font/google";

import LeftSidebar from "@/components/layout/LeftSidebar";
import MobileHearder from "@/components/layout/ModileHearder";
import RightSidebar from "@/components/layout/RightSidebar";
import Toolbar from "@/components/layout/Toolbar";
import Providers from "@/lib/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter-clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
        <div className="mx-auto lg:max-w-6xl flex min-h-screen flex-col bg-black">
          <MobileHearder />
          <div className="flex flex-1 md:h-screen">
            <LeftSidebar />
            <main className="mt-14 w-full overflow-y-auto border-r border-gray-200 pb-16 md:mt-0 md:w-1/2 md:pb-0 xl:w-3/5">
              {children}
            </main>
            <RightSidebar />
          </div>
          <Toolbar />
        </div>
        </Providers>
  
      </body>
    </html>
  );
}
