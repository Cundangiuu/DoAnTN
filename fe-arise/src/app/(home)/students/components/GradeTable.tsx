"use client";

import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { StudentGradeDTO } from "@/dtos/student/StudentGradeDTO";
import { StudentService } from "@/services";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Props = {
  studentId: number;
};

const GradeTable = ({ studentId }: Props) => {
  const [data, setData] = useState<StudentGradeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
  () => [
    { name: "Lớp học", key: "id" },
    { name: "Giữa kỳ", key: "midtermGrade" },
    { name: "Cuối kỳ", key: "finalGrade" },
    { name: "Kết quả môn học", key: "resultGrade" },
  ],
  []
);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      const response = await StudentService.getGradeOfStudentGroupedByClass(
        studentId
      );
      if (!response.data) return;
      setData(response.data);
      setLoading(false);
    };

    fetchGrades();
  }, []);

  const renderCell = (key: string, data: StudentGradeDTO) => {
    switch (key) {
      case "id":
        return (
          <Link
            href={`/classes/${data.id}?tab=grades`}
            className="text-blue-600 underline"
          >
            {data.id}
          </Link>
        );
      case "midtermGrade":
        return <p>{data.midtermGrade != null ? data.midtermGrade.toFixed(2) : "N/A"}</p>;
      case "finalGrade":
        return <p>{data.finalGrade != null ? data.finalGrade.toFixed(2) : "N/A"}</p>;
      case "resultGrade":
        return <p>{data.resultGrade != null ? data.resultGrade.toFixed(2) : "N/A"}</p>;
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
    <TableWrapper<StudentGradeDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data}
      isLoading={loading}
    />
  );
};

export default GradeTable;
