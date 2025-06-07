import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { getClassByCode } from "@/services/ClassService";
import { notFound } from "next/navigation";
import ClassInfoContextProvider from "../context/ClassInfoContext";

export default async function Layout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ code: string }> }>) {
    const { code } = await params;

    const response = await getClassByCode(code);

    if (!response.data) {
        notFound();
    }

    const defaultClass: ClassDTO = response.data

    return (
        <ClassInfoContextProvider defaultClass={defaultClass}>
            <div className="mt-6">
                <div className="flex flex-col gap-4">{children}</div>
            </div>
        </ClassInfoContextProvider>
    );
}