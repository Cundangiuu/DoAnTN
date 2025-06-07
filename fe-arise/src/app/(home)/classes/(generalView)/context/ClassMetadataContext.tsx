import { emptyPageable, Pageable } from "@/dtos/base"
import { ClassDTO } from "@/dtos/classes/ClassDTO"
import { createContext, useMemo, useState } from "react"

export type ClassMetadataContextProps = {
    pagingMetadata: Pageable<ClassDTO>
    setPagingMetadata: (metadata: Pageable<ClassDTO>) => void
}

export const ClassMetadataContext = createContext<ClassMetadataContextProps | undefined>(undefined)

type Props = {
    children: React.ReactNode
}

export default function ClassMetadataContextProvider(props: Readonly<Props>) {
    const [pagingMetadata, setPagingMetadata] = useState<Pageable<ClassDTO>>(emptyPageable())

    const initValue = useMemo<ClassMetadataContextProps>(() => ({
        pagingMetadata,
        setPagingMetadata
    }), [pagingMetadata])

    return <ClassMetadataContext.Provider value={initValue}>{props.children}</ClassMetadataContext.Provider>
}