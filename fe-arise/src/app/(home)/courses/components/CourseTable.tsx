"use client";

import TableWrapper from "@/components/molecules/table/TableWrapper";
import { FilterOptionType, Rest } from "@/components/type";
import { CourseLevelConstants } from "@/constants/course";
import { CourseDTO } from "@/dtos";
import { useMeaningfulContext } from "@/hooks";
import { Button, Selection } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FaPen } from "react-icons/fa";
import { CourseContext } from "../context/CourseContext";
import * as XLSX from "xlsx";
import { getCourseExport } from "@/services/CourseService";

const CourseTable: React.FC = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams.get("query") ?? undefined;
  const filterParam =
    (searchParams.get("filter") as string) ??
    Object.values(CourseLevelConstants).toString();
  const router = useRouter();
  const path = usePathname();
  const {
    isLoading,
    courses,
    filterValue,
    setFilterValue,
    selection,
    setSelection,
  } = useMeaningfulContext(CourseContext);
  const data = courses;

 const columns = [
    { name: "Mã khóa học", key: "code", align: "start" },
    { name: "Tên khóa học", key: "name", align: "start" },
    { name: "Học phí", key: "tuitionRate", align: "start" },
    { name: "Số giờ", key: "numberOfHour", align: "start" },
    { name: "Cấp độ", key: "level", align: "start" },
    { name: "Hành động", key: "Action" },
  ];

  const renderCell = (key: string, data: CourseDTO) => {
    const cellValue = data[key as keyof CourseDTO];

    switch (key) {
      case "code":
        return (
          <Link
            href={`/courses/${data.code}`}
            className="text-blue-600 underline"
          >
            {cellValue as string}
          </Link>
        );
      case "name":
        return <p> {cellValue as string}</p>;
      case "tuitionRate":
        return <p>{data.tuitionRate}</p>;
      case "numberOfHour":
        return <p>{data.numberHour}</p>;
      case "level":
        return <p>{data.courseLevel}</p>;
      case "Action":
        return (
          <div className="w-full relative flex justify-center">
            <Button
              as={Link}
              isIconOnly
              href={`/courses/${data.code}/edit`}
              color="warning"
            >
              <FaPen />
            </Button>
          </div>
        );
    }
  };

  const selectOptions: FilterOptionType[0]["options"] = Object.entries(
    CourseLevelConstants
  ).map(([key, value]) => ({
    key: value,
    label: key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()),
  }));

  const rest: Rest | undefined = data;

  const filterOptions: FilterOptionType = [
    {
      label: "Filter",
      props: {
        selectedKeys: selection,
        selectionMode: "multiple",
        onSelectionChange: (selection: Selection) => {
          setSelection(selection);
          const selected = Array.from(selection);

          router.push(`${path}/?filter=${selected}`);
        },
      },
      options: selectOptions,
    },
  ];

  const exportToExcel = async () => {
    const filter: CourseLevelConstants[] = filterParam
      ? filterParam
          .split(",")
          .map((key) => key.trim().toUpperCase() as CourseLevelConstants)
          .filter((key) => Object.values(CourseLevelConstants).includes(key))
      : [];
    const formattedData = await getCourseExport(filter, searchString);
    if (formattedData.status !== 200 || formattedData.data === undefined) {
      console.log("Failed to fetch data");
    }
    const worksheet = XLSX.utils.json_to_sheet(
      formattedData.data ? formattedData.data : []
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

    XLSX.writeFile(workbook, "Course.xlsx");
  };

  return (
    <TableWrapper<CourseDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data?.content ? data.content : []}
      isLoading={isLoading}
      filterValue={filterValue}
      setFilterValue={setFilterValue}
      onNew={() => router.push("/courses/new")}
      filterOptions={filterOptions}
      isExport={exportToExcel}
    />
  );
};

export default CourseTable;
