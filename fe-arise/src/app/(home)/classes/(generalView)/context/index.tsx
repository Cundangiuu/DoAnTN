"use client";

import { Pageable } from "@/dtos/base";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { classQuery } from "@/services/ClassService";
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
}: Readonly<{ children: React.ReactNode, classes: Pageable<ClassDTO> }>) {
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
      toast.error("Xuất dữ liệu thất bại. Vui lòng liên hệ quản trị viên.");
      return;
    }

    const exportData = response.data.content;
    if (!exportData || exportData.length === 0) {
      toast.error("Không có dữ liệu để xuất.");
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
        "STT": index + 1,
        "Mã lớp": classArise.code,
        "Tên lớp": classArise.name,
        "Tên khóa học": classArise.course?.name ?? "Không có",
        "Lịch học": `${classArise.schedules.map((s) => s.code).join(", ")}`,
        "Giảng viên": classArise.staff
          ? `${classArise.staff?.firstName} ${classArise.staff?.lastName}`
          : "Không có",
        "Bài học tiếp theo": nextClassDay?.lesson
          ? nextClassDay.lesson.description
          : "Không có",
        "Giảng viên tiếp theo": nextClassDay?.teacher
          ? `${nextClassDay.teacher.firstName} ${nextClassDay.teacher.lastName}`
          : "Không có",
        "Số lượng bài học": `${nextClassDayIndex === -1 ? 0 : nextClassDayIndex}/${classArise.classDays.length
          }`,
        "Số lượng học sinh": classArise.students.length,
        "Ngày bắt đầu": classArise.startDate
          ? DateToStringWithoutTime(new Date(classArise.startDate))
          : "Không có",
        "Địa điểm tiếp theo": nextClassDay?.location
          ? `${nextClassDay.location.branch} - ${nextClassDay.location.room}`
          : "Không có",
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
    <div className="relative"> {/* Để tạo vị trí cho lớp phủ */}
      <GeneralClassContext.Provider value={initValue}>
        {children}
      </GeneralClassContext.Provider>
    </div>
  );
}