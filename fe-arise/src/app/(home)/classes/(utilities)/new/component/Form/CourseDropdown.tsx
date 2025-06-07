"use client";

import { Pageable } from "@/dtos/base";
import { CourseDTO } from "@/dtos/course";
import { useMeaningfulContext } from "@/hooks";
import { getAllCourse } from "@/services/CourseService";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import DropdownForm from "./Dropdown";
import { DropdownContext } from "./DropdownContextProvider";

export default function CoursesDropdown() {
  const { searchValue, setLoading, loading, setOptions, selected } =
    useMeaningfulContext(DropdownContext);
  const [courses, setCourses] = useState<Pageable<CourseDTO>>();

  useEffect(() => {
    const getCourses = async () => {
      if (!loading) {
        setLoading(true);
      }
      const response = await getAllCourse(0, 5, [], undefined, searchValue);
      setLoading(false);
      if (!response.data) {
        toast.error("Failed to fetch students");
        return;
      }

      setCourses(response.data);
      setOptions(
        response.data.content.map((course) => ({
          key: course.name,
          value: course.id.toString(),
        }))
      );
    };

    getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <DropdownForm>
      {courses?.content
        .filter((course) => !selected.some((s) => s.key === course.name))
        .map((course) => (
          <Fragment key={course.id}>
            <p className="text-xs opacity-50">{course.code}</p>
            <p className="font-bold">{course.name}</p>
          </Fragment>
        ))}
    </DropdownForm>
  );
}
