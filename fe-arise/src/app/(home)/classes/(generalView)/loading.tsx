"use client";

import TableWrapper from "@/components/molecules/table/TableWrapper";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { useMeaningfulContext } from "@/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoMdPrint } from "react-icons/io";
import { columns, getFilterOptions } from "./constants";
import { ClassMetadataContext } from "./context/ClassMetadataContext";

export default function Loading() {
  const { pagingMetadata: data } = useMeaningfulContext(ClassMetadataContext);
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  const status = searchParams.get("status") ?? undefined;
  const params = new URLSearchParams(Array.from(useSearchParams()));
  const number = Number(searchParams.get("page") ?? "0");
  const searchString = searchParams.get("query") ?? undefined;

  const selection = new Set([status ?? "all"]);

  const rest = data;

  const filterOptions = getFilterOptions(selection, params, path, router);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#f0f4f8] rounded-lg shadow-md">
      {/* Loading Title */}
      <h2 className="text-2xl font-semibold text-[#2255a6] mb-4">
        Loading data...
      </h2>

      {/* Progress Bar (optional) */}
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#2255a6] animate-pulse"
          style={{ width: "75%" }} // Adjust width to display progress
        ></div>
      </div>

      {/* Loading Message */}
      <p className="text-gray-700 italic">
        Please wait a moment...
      </p>

      {/* Loading Table */}
      <TableWrapper<ClassDTO>
        disabled
        rest={{ ...rest, number }}
        columns={columns}
        renderCell={() => <></>}
        data={data?.content}
        isLoading={true}
        filterValue={searchString}
        setFilterValue={() => {}}
        onNew={() => {}}
        filterOptions={filterOptions}
        isExport={() => {}}
        onPrint={[
          {
            label: "Test Day Report",
            type: "testDay",
            icon: IoMdPrint,
            action: () => {},
            color: "primary",
          },
          {
            label: "Absence Report",
            type: "absence",
            icon: IoMdPrint,
            action: () => {},
            color: "primary",
          },
        ]}
      />
    </div>
  );
}