"use client";

import { SessionContext } from "@/contexts/SessionContext";
import { useMeaningfulContext } from "@/hooks";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import BreadCrumb from "./BreadCrumb";

const AvatarDropDown = () => {
  const { user } = useMeaningfulContext(SessionContext);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-1 rounded-xl border-1">
      <p className="text-sm">{user.name}</p>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          {user?.image && (
            <Avatar
              isBordered
              as="button"
              radius="sm"
              className="transition-transform"
              color="secondary"
              size="sm"
              src={user?.image}
            />
          )}
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user?.email || ""}</p>
          </DropdownItem>
          <DropdownItem onPress={() => signOut()} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default function Header() {
  return (
    <Navbar maxWidth="full" shouldHideOnScroll>
      <NavbarBrand>
        <BreadCrumb />
      </NavbarBrand>
      <NavbarContent justify="end">
        <AvatarDropDown />
      </NavbarContent>
    </Navbar>
  );
}
