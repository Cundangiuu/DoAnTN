"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ClassMetadataContextProvider from "../context/ClassMetadataContext";

export default function TabClass({
  children,
  roles,
}: Readonly<{ children: React.ReactNode; roles: string[] }>) {
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  return (
    <ClassMetadataContextProvider>
      <div className="bg-white rounded-lg shadow-md p-4">
        <Tabs
          key={searchParams.toString()}
          aria-label="Thông tin"
          color="primary"
          variant="light"
          classNames={{
            tabList: "bg-gray-50 rounded-t-lg",
            tab:
              "text-sm font-medium data-[selected=true]:text-blue-500 data-[selected=true]:bg-white",
            panel: "p-4",
          }}
          selectedKey={searchParams.get("view") ?? "my-classes"}
          defaultSelectedKey={searchParams.get("view") ?? undefined}
          onSelectionChange={(key) => {
            const sp = new URLSearchParams(searchParams.toString());
            sp.set("view", key.toString());
            router.push(`${path}?${sp.toString()}`);
          }}
        >
          {roles.some((r) => r === "ACADEMIC_STAFF" || r === "TEACHER") && (
            <Tab title="Lớp của tôi" key={"my-classes"}>
              {children}
            </Tab>
          )}
          <Tab title="Tất cả lớp" key={"all-classes"}>
            {children}
          </Tab>
        </Tabs>
      </div>
    </ClassMetadataContextProvider>
  );
}