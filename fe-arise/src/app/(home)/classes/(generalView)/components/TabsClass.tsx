"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ClassMetadataContextProvider from "../context/ClassMetadataContext";

export default function TabClass({ children, roles }: Readonly<{ children: React.ReactNode, roles: string[] }>) {
    const searchParams = useSearchParams();
    const path = usePathname();
    const router = useRouter();

    return <ClassMetadataContextProvider>

        <Tabs
            key={searchParams.toString()}
            aria-label="Infos"
            color="primary"
            selectedKey={searchParams.get("view") ?? "my-classes"}
            defaultSelectedKey={searchParams.get("view") ?? undefined}
            onSelectionChange={(key) => {
                const sp = new URLSearchParams(searchParams.toString());
                sp.set("view", key.toString());
                router.push(`${path}?${sp.toString()}`);
            }}
        >

            {roles.some((r) => r === "ACADEMIC_STAFF" || r === "TEACHER") && (
                <Tab title="My Classes" key={"my-classes"}>
                    {children}
                </Tab>
            )}
            <Tab title="All Classes" key={"all-classes"}>
                {children}
            </Tab>
        </Tabs>
    </ClassMetadataContextProvider>
}