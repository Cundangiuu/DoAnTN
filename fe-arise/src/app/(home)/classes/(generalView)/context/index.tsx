"use client";

import { Pageable } from "@/dtos/base";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { classQuery} from "@/services/ClassService";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  GeneralClassContext,
  GeneralClassesContextProps,
} from "./GeneralClassesContext";

export default function GeneralClassContextProvider({
  classes,
  children,
}: Readonly<{ children: React.ReactNode; classes: Pageable<ClassDTO> }>) {
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  const searchString = searchParams.get("query") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const defaultView = searchParams.get("view") ?? undefined;

  const exportToExcel = useCallback(async () => {
    const response = await classQuery(0, 1_000_000, defaultView, searchString, status);
    if (response.status === 401) {
      return redirect("/login");
    }

    if (!response.data) {
      toast.error("Failed to export data. Please contact the administrator.");
      return;
    }

    const exportData = response.data.content;
    if (!exportData || exportData.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const formattedData = exportData.map((classArise, index) => {
      const nextClassDayIndex = classArise.classDays.findIndex(
        (c) => {
          if (!c.classDate) return;

          const classDate = new Date(c.classDate);

          if (!c.schedule) {
            return classDate && new Date(classDate).getTime() > new Date().getTime()
          }

          const endTime = new Date(c.schedule.endTime);

          classDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

          return classDate && new Date(classDate).getTime() > new Date().getTime()
        }
      );

      const nextClassDay = classArise.classDays[nextClassDayIndex];

      return {
        "No.": index + 1,
        "Class Code": classArise.code,
        "Class Name": classArise.name,
        "Course Name": classArise.course?.name ?? "None",
        "Schedule": `${classArise.schedules.map((s) => s.code).join(", ")}`,
        "Instructor": classArise.staff
          ? `${classArise.staff?.firstName} ${classArise.staff?.lastName}`
          : "None",
        "Next Lesson": nextClassDay?.lesson
          ? nextClassDay.lesson.description
          : "None",
        "Next Instructor": nextClassDay?.teacher
          ? `${nextClassDay.teacher.firstName} ${nextClassDay.teacher.lastName}`
          : "None",
        "Number of Lessons": `${nextClassDayIndex === -1 ? 0 : nextClassDayIndex}/${classArise.classDays.length
          }`,
        "Number of Students": classArise.students.length,
        "Start Date": classArise.startDate
          ? DateToStringWithoutTime(new Date(classArise.startDate))
          : "None",
        "Next Location": nextClassDay?.location
          ? `${nextClassDay.location.branch} - ${nextClassDay.location.room}`
          : "None",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Classes");
    XLSX.writeFile(workbook, "Classes.xlsx");
  }, [defaultView, searchString, status]);

  const initValue = useMemo<GeneralClassesContextProps>(
    () => ({
      classes,
      filterValue: searchString,
      selection: new Set([status ?? "all"]),
      currentView: defaultView,
      searchParams,
      path,
      router,
      exportToExcel,
    }),
    [classes, defaultView, exportToExcel, path, router, searchParams, searchString, status]
  );

  return (
    <div className="relative">
      {/* To create a position for the overlay */}
      <GeneralClassContext.Provider value={initValue}>
        {children}
      </GeneralClassContext.Provider>
    </div>
  );
}