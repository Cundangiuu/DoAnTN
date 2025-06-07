"use client";

import TableWrapper from "@/components/molecules/table/TableWrapper";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { useMeaningfulContext } from "@/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoMdPrint } from "react-icons/io";
import { columns, getFilterOptions } from "./constants";
import { ClassMetadataContext } from "./context/ClassMetadataContext";

export default function Loading() {
    const { pagingMetadata: data } = useMeaningfulContext(ClassMetadataContext)
    const searchParams = useSearchParams();
    const path = usePathname();
    const router = useRouter();

    const status = searchParams.get("status") ?? undefined;
    const params = new URLSearchParams(Array.from(useSearchParams()));
    const number = Number(searchParams.get("page") ?? '0');
    const searchString = searchParams.get("query") ?? undefined;

    const selection = new Set([status ?? "all"]);

    const rest = data

    const filterOptions = getFilterOptions(selection, params, path, router);

    return <TableWrapper<ClassDTO>
        disabled
        rest={{ ...rest, number }}
        columns={columns}
        renderCell={() => <></>}
        data={data?.content}
        isLoading={true}
        filterValue={searchString}
        setFilterValue={() => { }}
        onNew={() => { }}
        filterOptions={filterOptions}
        isExport={() => { }}
        onPrint={[
            {
                label: "Test Day Report",
                type: "testDay",
                icon: IoMdPrint,
                action: () => { },
                color: "primary",
            },
            {
                label: "Absence Report",
                type: "absence",
                icon: IoMdPrint,
                action: () => { },
                color: "primary",
            },
        ]}
    />
}