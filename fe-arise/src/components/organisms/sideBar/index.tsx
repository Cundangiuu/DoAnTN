"use client";

import { SessionContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { FaKeyboard } from "react-icons/fa";
import { IoIosBook, IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import Anchor, { AnchorProps } from "./anchor";

export default function SideBar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAdmin, isAccountant } = useMeaningfulContext(SessionContext);
  const anchors: AnchorProps[] = [
    {
      icon: MdDashboard,
      href: "/#",
      children: "Dashboard",
    },
    {
      icon: FaKeyboard,
      href: "/classes?status=ON_GOING&view=my-classes",
      children: "Classes",
    },
    {
      icon: IoIosBook,
      href: "/courses",
      children: "Courses",
    },
    {
      icon: PiStudentFill,
      href: "/students",
      children: "Students",
    },
    ...(isAdmin || isAccountant
      ? [
          {
            icon: RiMoneyDollarBoxLine,
            href: "/accounting",
            children: "Accounting",
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            icon: IoMdSettings,
            href: "/settings",
            children: "Admin Portal",
          },
        ]
      : []),
  ];

  return (
    <>
      <nav
        className={`h-screen flex-shrink-0 bg-white w-full max-w-48 shadow-lg sticky top-0 left-0 z-[200]`}
      >
        <div className="w-full h-full absolute right-0 top-0 flex flex-col border-r-2 border-solid border-white">
          <div className="w-full flex relative">
            <Link
              className="flex-grow relative flex justify-center overflow-hidden items-center p-4"
              href="/"
            >
              <Image
                alt="logo"
                src="/logo.png"
                priority
                width={500}
                height={500}
                className="object-contain w-full h-full object-center"
              />
            </Link>
          </div>
          <div className="w-full flex flex-col flex-grow mt-2 p-4 gap-2">
            {anchors.map((a) => (
              <Anchor key={a.href} {...a} />
            ))}
          </div>
        </div>
      </nav>
      <div className={`max-w-full flex flex-col min-h-full w-full`}>
        {children}
      </div>
    </>
  );
}
