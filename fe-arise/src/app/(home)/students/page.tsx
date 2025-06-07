"use client";

import { Pageable } from "@/dtos/base";
import { StudentDTO } from "@/dtos/student/StudentDTO";
import { StudentService } from "@/services";
import { Selection } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "../../../components/molecules/table/Loading";
import StudentTable from "./components/StudentTable";
import { StudentContext } from "./context/StudentContext";

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Pageable<StudentDTO>>();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;
  const queryParam = searchParams.get("query")
    ? String(searchParams.get("query"))
    : null;
  const hasAvatarParam = searchParams.get("hasAvatar")
    ? String(searchParams.get("hasAvatar"))
    : "both";

  const [filterValue, setFilterValue] = useState(queryParam);
  const [hasAvatarValue, setHasAvatarValue] = useState<Selection>(
    new Set(hasAvatarParam?.split(", "))
  );

  useEffect(() => {
    const getStudents = async () => {
      setIsLoading(true);
      const response = await StudentService.getAllStudents(
        page,
        size,
        queryParam,
        hasAvatarParam
      );
      setStudents(response.data);
      setIsLoading(false);
    };

    getStudents();
  }, [page, size, queryParam, hasAvatarParam]);

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        isLoading,
        setIsLoading,
        filterValue,
        setFilterValue,
        hasAvatarValue,
        setHasAvatarValue,
      }}
    >
      <StudentTable />
    </StudentContext.Provider>
  );
};

const Page: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <StudentsPage />
  </Suspense>
);

export default Page;
