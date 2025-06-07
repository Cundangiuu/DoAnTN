"use client"

import { ClassDTO } from "@/dtos/classes/ClassDTO"
import { createContext, useMemo } from "react"

export type ClassInfoContext = {
    defaultClass?: ClassDTO
}

export const ClassInfoContext = createContext<ClassInfoContext | undefined>(undefined)

export default function ClassInfoContextProvider({ children, defaultClass }: Readonly<ClassInfoContext & { children: React.ReactNode }>) {
    const contextValue = useMemo(() => ({ defaultClass }), [defaultClass]);

    return <ClassInfoContext.Provider value={contextValue}>{children}</ClassInfoContext.Provider>
}