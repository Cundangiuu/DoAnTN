"use client";

import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { AbsenceDTO } from "@/dtos/absence/AbsenceDTO";
import { getAllAbsenceByStudent } from "@/services/AbsenceService";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { Switch } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  studentCode: string;
  isReadonly?: boolean;
};

const AttendanceTable = ({ studentCode, isReadonly }: Props) => {
  const [data, setData] = useState<AbsenceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = [
  { name: "Ngày học", key: "classDate" },
  { name: "Lớp học", key: "classCode" },
  { name: "Điểm danh", key: "checkAbsent" },
];


  useEffect(() => {
    const getAbsence = async () => {
      try {
        const response = await getAllAbsenceByStudent(studentCode);
        if (!response.data) {
          return;
        }
        setData(response.data);
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while fetching attendance data");
      } finally {
        setLoading(false);
      }
    };

    getAbsence();
  }, [studentCode]);

  const renderCell = (key: string, data: AbsenceDTO) => {
    const cellValue = data[key as keyof AbsenceDTO];
    switch (key) {
      case "classDate":
        return (
          <Link
            href={`/classes/${data.classCode}/${data.classDayId}`}
            className="text-blue-600 underline hover:text-blue-400"
          >
            {DateToStringWithoutTime(cellValue as Date)}
          </Link>
        );
      case "classCode":
        return <div>{data.classCode}</div>;
      case "checkAbsent":
        return (
          <Switch
            isSelected={!data.checkAbsent}
            isReadOnly={isReadonly}
            isDisabled={true}
          />
        );
    }
  };

  const rest: Rest | undefined = {
    totalElements: data.length,
    totalPages: 0,
    size: data.length,
    number: data.length,
    pageable: {
      pageNumber: 0,
      pageSize: data.length,
      offset: 0,
      sort: [],
      paged: true,
      unpaged: false,
    },
    sort: [],
    first: true,
    last: true,
    empty: false,
    numberOfElements: data.length,
  };

  return (
    <TableWrapper<AbsenceDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data}
      isLoading={loading}
    />
  );
};

export default AttendanceTable;
