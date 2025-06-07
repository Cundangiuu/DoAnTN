import { auth } from "@/auth";
import { notFound } from "next/navigation";
import TabClass from "./components/TabsClass";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (!session) return notFound();

    const { roles } = session;

    return <TabClass roles={roles.map(r => r.name)}>{children}</TabClass>;
}