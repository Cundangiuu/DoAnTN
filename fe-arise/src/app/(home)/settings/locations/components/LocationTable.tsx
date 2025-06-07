"use client";

import GroupActionButton from "@/components/molecules/table/GroupActionButton";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { LocationDTO } from "@/dtos/location/LocationDTO";
import { useMeaningfulContext } from "@/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { LocationContext } from "../context/LocationContext";

const LocationTable: React.FC = () => {
  const router = useRouter();
  const { locations, isLoading } = useMeaningfulContext(LocationContext);
  const data = locations;

  const columns = [
    { name: "Code", key: "code", align: "start" },
    { name: "Action", key: "Action" },
  ];

  const renderCell = (key: string, data: LocationDTO) => {
    const cellValue = data[key as keyof LocationDTO];

    switch (key) {
      case "code":
        return (
          <Link
            href={`/settings/locations/${data.id}`}
            className="text-blue-600 underline"
          >
            {cellValue?.toString()}
          </Link>
        );
      case "Action":
        return <GroupActionButton detailId={data.id} />;
    }
  };

  const rest: Rest | undefined = data;

  return (
    <TableWrapper
      rest={rest}
      columns={columns}
      data={data?.content}
      renderCell={renderCell}
      isLoading={isLoading}
      onNew={() => router.push("/settings/locations/new")}
    />
  );
};

export default LocationTable;
