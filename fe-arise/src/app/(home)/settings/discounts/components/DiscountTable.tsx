"use client";

import GroupActionButton from "@/components/molecules/table/GroupActionButton";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { DiscountDTO } from "@/dtos/discount/DiscountDTO";
import { useMeaningfulContext } from "@/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { DiscountContext } from "../context/DiscountContext";

const DiscountTable: React.FC = () => {
  const router = useRouter();
  const { discounts, isLoading } = useMeaningfulContext(DiscountContext);
  const data = discounts;
  const columns = [
  { name: "Loại", key: "type", align: "start" },
  { name: "Mô tả", key: "description" },
  { name: "Hành động", key: "Action" },
];


  const renderCell = (key: string, data: DiscountDTO) => {
    const cellValue = data[key as keyof DiscountDTO];

    switch (key) {
      case "type":
        return (
          <Link
            href={`/settings/discounts/${data.id}`}
            className="text-blue-600 underline"
          >
            {cellValue ? cellValue.toString() : ""}
          </Link>
        );
      case "description":
        return (
          <div className="flex justify-center items-center">
            {cellValue ? cellValue.toString() : ""}
          </div>
        );
      case "Action":
        return <GroupActionButton detailId={data.id} />;
    }
  };

  const rest: Rest | undefined = data;

  return (
    <TableWrapper<DiscountDTO>
      rest={rest}
      columns={columns}
      data={data?.content}
      renderCell={renderCell}
      isLoading={isLoading}
      onNew={() => router.push("/settings/discounts/new")}
    />
  );
};

export default DiscountTable;
