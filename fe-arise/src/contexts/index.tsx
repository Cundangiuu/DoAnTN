"use client";

import { NextUIProvider } from "@nextui-org/react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useScrollLock } from "usehooks-ts";
import { HeaderContext } from "./HeaderContext";
import { ModalContext } from "./ModalContext";
import { NewOrEditContext } from "./NewOrEditContext";
import { SessionContext } from "./SessionContext";
import { SideBarContext } from "./SideBarContext";
import { UtilitiesContext } from "./UtilitiesContext";

type Props = {
  children: React.ReactNode;
};

export default function AppContext(props: Readonly<Props>) {
  const [modalContent, setModalContent] = useState<React.ReactNode>(undefined);
  const [contentHeader, setContentHeader] =
    useState<React.ReactNode>(undefined);
  const [showHeaderContent, setShowHeaderContent] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(true);
  const [nonInstructiveSideBar, setNonInstructiveSideBar] = useState(false);
  const { lock, unlock, isLocked } = useScrollLock({ autoLock: false });
  const [user, setUser] = useState<User | null>();
  const [roles, setRoles] = useState<string[] | undefined>();
  const session = useSession();

  useEffect(() => {
    if (session?.data) {
      setUser({
        ...session.data.user,
        id: session.data.userId,
      });
      setRoles(session.data.roles?.map((role) => role.name) || []);
    }
  }, [session]);

  const sessionInitValue = useMemo(() => {
    const isTeacher = roles?.length === 1 && roles[0] === "TEACHER";
    const isAdmin = roles?.includes("ADMIN") || false;
    const isAccountant = roles?.includes("ACCOUNTANT") || false;

    return {
      isTeacher,
      isAdmin,
      isAccountant,
      user,
      roles,
    };
  }, [roles, user]);

  const pathName = usePathname();
  const lastPath = pathName.split("/").at(-1);
  const newOrEditInitValue = useMemo(
    () => ({
      isNew: lastPath === "new",
      isEdit: lastPath === "edit",
    }),
    [lastPath]
  );

  const modalInitValue = useMemo(
    () => ({
      modalContent,
      showModal(content: NonNullable<React.ReactNode>) {
        setModalContent(content);
        lock();
      },
      hideModal() {
        setModalContent(undefined);
        unlock();
      },
    }),
    [modalContent, setModalContent, lock, unlock]
  );

  const utilityInitValue = useMemo(
    () => ({
      bodyScrollLock: { lock, unlock, isLocked },
    }),
    [lock, unlock, isLocked]
  );

  const sideBarInitValue = useMemo(
    () => ({
      open: openSideBar,
      setOpen: setOpenSideBar,
      nonInstructive: nonInstructiveSideBar,
      setNonInstructive: setNonInstructiveSideBar,
    }),
    [
      openSideBar,
      setOpenSideBar,
      nonInstructiveSideBar,
      setNonInstructiveSideBar,
    ]
  );

  const headerInitValue = useMemo(
    () => ({
      contentHeader,
      setContentHeader,
      showContent: showHeaderContent,
      setShowContent: setShowHeaderContent,
    }),
    [contentHeader, setContentHeader, showHeaderContent, setShowHeaderContent]
  );

  return (
    <NextUIProvider locale="en-IN">
      <SessionContext.Provider value={sessionInitValue}>
        <NewOrEditContext.Provider value={newOrEditInitValue}>
          <SideBarContext.Provider value={sideBarInitValue}>
            <HeaderContext.Provider value={headerInitValue}>
              <ModalContext.Provider value={modalInitValue}>
                <UtilitiesContext.Provider value={utilityInitValue}>
                  {props.children}
                </UtilitiesContext.Provider>
              </ModalContext.Provider>
            </HeaderContext.Provider>
          </SideBarContext.Provider>
        </NewOrEditContext.Provider>
      </SessionContext.Provider>
    </NextUIProvider>
  );
}

export * from "./HeaderContext";
export * from "./ModalContext";
export * from "./SessionContext";
export * from "./SideBarContext";
export * from "./UtilitiesContext";
