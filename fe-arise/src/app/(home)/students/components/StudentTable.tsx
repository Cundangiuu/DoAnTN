"use client";

import GroupActionButton from "@/components/molecules/table/GroupActionButton";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { FilterOptionType, Rest } from "@/components/type";
import { StudentDTO } from "@/dtos/student/StudentDTO";
import { useMeaningfulContext } from "@/hooks";
import { exportStudents } from "@/services/StudentService";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { updateSearchParams } from "@/utils/UrlUtil";
import { Selection, User } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { StudentContext } from "../context/StudentContext";

const StudentTable: React.FC = () => {
  const router = useRouter();
  const path = usePathname();
  const params = new URLSearchParams(Array.from(useSearchParams()));

  const {
    isLoading,
    filterValue,
    setFilterValue,
    hasAvatarValue,
    setHasAvatarValue,
    students,
  } = useMeaningfulContext(StudentContext);
  const data = students;

  const columns = [
    { name: "Tên", key: "name", align: "start" },
    { name: "Mã", key: "code" },
    { name: "Biệt danh", key: "nickname" },
    { name: "Số điện thoại", key: "phoneNumber" },
    { name: "Ngày sinh", key: "dateOfBirth" },
    { name: "Action", key: "Action" },
  ];

  const renderCell = (key: string, data: StudentDTO) => {
    const cellValue = data[key as keyof StudentDTO];

    switch (key) {
      case "code":
        return (
          <Link
            href={`/students/${cellValue}`}
            className="text-blue-600 underline"
          >
            {cellValue?.toString()}
          </Link>
        );
      case "name":
        return (
          <User
            {...(data.avatarUrl
              ? {
                  avatarProps: {
                    src: `/api/images?filePath=${data.avatarUrl}`,
                  },
                }
              : {})}
            description={data.emailAddress}
            name={cellValue?.toString()}
          >
            {data.emailAddress}
          </User>
        );
      case "nickname":
        return (
          <div className="flex justify-center items-center">
            {cellValue?.toString()}
          </div>
        );
      case "phoneNumber":
        return (
          <div className="flex justify-center items-center">
            {cellValue?.toString()}
          </div>
        );
      case "dateOfBirth":
        return (
          <div className="flex justify-center items-center">
            {DateToStringWithoutTime(cellValue as Date)}
          </div>
        );
      case "Action":
        return <GroupActionButton detailId={data.code} />;
    }
  };

  const rest: Rest | undefined = data;
  const filterOptions: FilterOptionType = [
    {
      label: "Avatar",
      props: {
        disallowEmptySelection: true,
        selectedKeys: hasAvatarValue,
        selectionMode: "single",
        onSelectionChange: (selection: Selection) => {
          setHasAvatarValue(selection);
          const selectedKeys = Array.from(selection)
            .join(", ")
            .replace(/_/g, "");
          const updatedParams = updateSearchParams(
            new URLSearchParams(params.toString()),
            {
              hasAvatar: selectedKeys,
              page: "1",
            }
          );
          router.push(`${path}?${updatedParams}`);
        },
      },
      options: [
        { key: "both", label: "Both" },
        { key: "have", label: "Have" },
        { key: "not have", label: "Not Have" },
      ],
    },
  ];

  const exportToExcel = async () => {
    const queryParam = params.get("query") ? String(params.get("query")) : null;
    const hasAvatarParam = params.get("hasAvatar")
      ? String(params.get("hasAvatar"))
      : "both";
    const response = await exportStudents(queryParam, hasAvatarParam);

    if (response.status != 200) {
      toast.error("Failed to export data. Please contact the administrator.");
      return;
    }

    const exportData = response.data;
    if (!exportData || exportData.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const formattedData = exportData.map((student, index) => ({
      No: index + 1,
      Code: student.code,
      Name: student.name,
      Nickname: student.nickname,
      "Date Of Birth": DateToStringWithoutTime(new Date(student.dateOfBirth)),
      "Phone Number": student.phoneNumber,
      "Email Address": student.emailAddress,
      Address: student.address,
      "Created At": new Date(student.createdAt).toString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Student.xlsx");
  };

  return (
    <TableWrapper<StudentDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data?.content}
      isLoading={isLoading}
      filterValue={filterValue}
      setFilterValue={setFilterValue}
      onNew={() => router.push("/students/new")}
      filterOptions={filterOptions}
      isExport={exportToExcel}
    />
  );
};

export default StudentTable;
