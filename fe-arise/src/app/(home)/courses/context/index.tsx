"use client";

import { CourseLevelConstants } from "@/constants/course";
import { CourseDTO } from "@/dtos";
import { Pageable } from "@/dtos/base";
import { getAllCourse } from "@/services/CourseService";
import { Selection } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CourseContext } from "./CourseContext";

export default function CourseContextProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [courses, setCourses] = useState<Pageable<CourseDTO>>();
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;
  const searchString = searchParams.get("query") ?? undefined;
  const filterParam =
    (searchParams.get("filter") as string) ??
    Object.values(CourseLevelConstants).toString();

  const [selection, setSelection] = useState<Selection>(
    new Set(filterParam.split(","))
  );

  const initValue = useMemo(
    () => ({
      courses,
      setCourses,
      isLoading,
      setIsLoading,
      filterValue,
      setFilterValue,
      selection,
      setSelection,
    }),
    [courses, filterValue, isLoading, selection]
  );

  useEffect(() => {
    const filter: CourseLevelConstants[] = filterParam
      ? filterParam
          .split(",")
          .map((key) => key.trim().toUpperCase() as CourseLevelConstants)
          .filter((key) => Object.values(CourseLevelConstants).includes(key))
      : [];
    const getCourses = async () => {
      setIsLoading(true);
      const response = await getAllCourse(
        page,
        size,
        ["createdAt,desc"],
        filter,
        searchString
      );
      if (!response.data) {
        toast.error("Failed to fetch classes");
        return;
      }
      setCourses(response.data);
      setIsLoading(false);
    };

    getCourses();
  }, [page, size, filterParam, searchString]);

  return (
    <CourseContext.Provider value={initValue}>
      {children}
    </CourseContext.Provider>
  );
}
