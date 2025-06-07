"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

export type AnchorProps = {
  href: string;
  icon: IconType;
  children: string;
  childrenAnchor?: {
    href: string;
    children: string;
    icon: IconType;
  }[];
};

export default function Anchor(props: Readonly<AnchorProps>) {
  const path = usePathname();
  const active = path.startsWith(props.href);

  return (
    <div className="w-full group/anchor">
      <Link
        href={props.href}
        className={`w-full flex justify-start items-center ${
          active ? "text-primary bg-default-100" : "bg-transparent"
        } group-hover/anchor:bg-neutral py-2 px-2 rounded-xl ${
          props.childrenAnchor && props.childrenAnchor.length > 0
            ? "group-hover/anchor:rounded-b-none"
            : ""
        } font-bold group-hover/anchor:text-primary group-hover/anchor:bg-default-100`}
      >
        <div className="flex flex-row gap-2 items-center">
          <props.icon className="w-6 h-6" />
          <p className="text-xs">{props.children}</p>
        </div>
      </Link>
      {props.childrenAnchor && (
        <div
          className={`w-full flex flex-col gap-2 ml-3 ${
            active ? "max-h-[600px]" : "max-h-0"
          } group-hover/anchor:max-h-[600px] overflow-hidden`}
        >
          {props.childrenAnchor.map((c) => (
            <div key={c.href} className="w-full flex">
              <Link
                href={c.href}
                className={`w-full py-2 px-4 ${
                  path.startsWith(c.href)
                    ? "gap-3 text-neutral-accent"
                    : "gap-2"
                } hover:gap-3 flex text-xs items-center hover:text-neutral-accent font-bold`}
              >
                <c.icon />
                <p>{c.children}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
