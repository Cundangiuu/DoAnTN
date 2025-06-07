"use client";

import Header from "@/components/organisms/header";
import SideBar from "@/components/organisms/sideBar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full relative">
      <SideBar>
        <Header />
        <div className="flex w-full flex-grow flex-col p-6">{children}</div>
      </SideBar>
    </div>
  );
}
