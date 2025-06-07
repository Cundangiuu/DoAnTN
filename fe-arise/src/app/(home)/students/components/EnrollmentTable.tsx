"use client";

import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { EnrollmentDTO } from "@/dtos/enrollment/EnrollmentDTO";
import { getAllEnrollmentByStudent } from "@/services/EnrollmentService";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  studentCode: string;
  isReadonly?: boolean;
};

const EnrollmentTable = ({ studentCode }: Props) => {
  const [data, setData] = useState<EnrollmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { name: "Course", key: "course" },
    { name: "Class", key: "classCode" },
    { name: "Enrollment Date", key: "enrollmentDate" },
    { name: "Action", key: "Action" },
  ];

  useEffect(() => {
    const getAbsence = async () => {
      try {
        const response = await getAllEnrollmentByStudent(studentCode);
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

  const renderCell = (key: string, data: EnrollmentDTO) => {
    const cellValue = data[key as keyof EnrollmentDTO];
    switch (key) {
      case "course":
        return (
          <Link
            href={`/courses/${data.courseCode}`}
            className="text-blue-600 underline hover:text-blue-400"
          >
            <div>{data.courseName}</div>
          </Link>
        );
      case "classCode":
        return (
          <Link
            href={`/classes/${data.classCode}`}
            className="text-blue-600 underline hover:text-blue-400"
          >
            <div>{data.className}</div>
          </Link>
        );
      case "enrollmentDate":
        return <div>{DateToStringWithoutTime(cellValue as Date)}</div>;
      case "Action":
        return (
          <Button
            as={Link}
            isIconOnly
            href={`/courses/${data.courseCode}`}
            disabled={loading}
          >
            <FaPen />
          </Button>
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
    <TableWrapper<EnrollmentDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data}
      isLoading={loading}
    />
  );
};

export default EnrollmentTable;
