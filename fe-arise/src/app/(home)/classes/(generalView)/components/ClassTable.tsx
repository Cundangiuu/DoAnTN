"use client";

import { DeleteActionButton } from "@/components";
import { EditButton } from "@/components/molecules/form";
import ReportViewer from "@/components/molecules/reportViewer";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { DataType, Rest } from "@/components/type";
import { StaffDTO } from "@/dtos";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { ScheduleDTO } from "@/dtos/schedule/ScheduleDTO";
import { useMeaningfulContext } from "@/hooks";
import { deleteClass } from "@/services/ClassService";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { Button, ButtonGroup, Tooltip, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ComponentProps, useState } from "react";
import { FaEye, FaLink } from "react-icons/fa";
import { IoMdPrint } from "react-icons/io";
import { toast } from "sonner";
import { getFilterOptions } from "../constants";
import { ClassMetadataContext } from "../context/ClassMetadataContext";
import { GeneralClassContext } from "../context/GeneralClassesContext";
import ClassStatusLabel from "./ClassStatusLabel";

const ClassTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const params = new URLSearchParams(Array.from(useSearchParams()));
  const { classes, selection, exportToExcel, filterValue } =
    useMeaningfulContext(GeneralClassContext);
  const { setPagingMetadata } = useMeaningfulContext(ClassMetadataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeReport, setActiveReport] = useState("testDay");

  const data = classes;

  const columns = [
    { name: "Mã lớp", key: "code", align: "start" },
    { name: "Tên lớp", key: "name" },
    { name: "Lịch học", key: "schedules" },
    { name: "Giảng viên", key: "staff" },
    { name: "Thông tin lớp", key: "classInfo" },
    { name: "Ngày bắt đầu", key: "startDate" },
    { name: "Địa điểm", key: "location" },
    { name: "Hành động", key: "Action" },
  ];
  const handleReportToggle = (reportType: string) => {
    setActiveReport(reportType);
    onOpen();
  };

  const deleteAction = async (id: number) => {
    setLoading(true);
    const response = await deleteClass(id);
    if (response.status !== 200) {
      toast.error("Không thể xóa lớp học");
      return response;
    }

    toast.success("Đã xóa lớp học");
    if (!classes) {
      return response;
    }

    const temp = structuredClone(classes);
    const index = temp.content.findIndex((c) => c.id === id);
    temp.content.splice(index, 1);
    setLoading(false);
    router.refresh();
    return response;
  };

  const renderCell = (key: string, data: ClassDTO) => {
    const cellValue = data[key as keyof ClassDTO];
    const cds = structuredClone(data.classDays).toSorted((a, b) => {
      return (
        new Date(a.classDate ?? 0).getTime() -
        new Date(b.classDate ?? 0).getTime()
      );
    });

    const cd = cds.find(
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

    switch (key) {
      case "code":
        return (
          <div className="flex items-center flex-col gap-2">
            <Link
              href={`/classes/${cellValue as string}`}
              className="text-[#2255a6] underline hover:text-[#2255a6] font-semibold"
            >
              {cellValue as string}
            </Link>
            <ClassStatusLabel classArise={data} />
          </div>
        );
      case "name":
        return <p>{cellValue as string}</p>;
      case "startDate":
        return (
          <div className="flex justify-center items-center">
            {DateToStringWithoutTime(new Date(cellValue as string))}
          </div>
        );
      case "schedules":
        return (
          <div className="flex justify-center whitespace-nowrap items-center gap-2">
            {(cellValue as ScheduleDTO[]).map((s) => (
              <p
                key={s.id}
                className="bg-orange-500 text-white px-2 rounded-full text-xs"
              >
                {s.code}
              </p>
            ))}
          </div>
        );
      case "classInfo": {
        const lesson = cd?.lesson.description ?? "Không có";
        const teacher = cd?.teacher
          ? `${cd.teacher.firstName} ${cd.teacher.lastName}`
          : "Không có";

        return (
          <div className="text-left flex flex-col gap-2">
            <p className="flex items-center gap-2">
              Bài học tiếp theo:{" "}
              {lesson === "Không có" ? (
                lesson
              ) : (
                <Tooltip
                  color="default"
                  placement="bottom"
                  size="md"
                  content={
                    <p className="text-wrap max-w-72 p-2 my-1 border-2 border-dashed rounded-lg whitespace-pre-line">
                      {lesson}
                    </p>
                  }
                >
                  <Link
                    href={`/classes/${data.code}?view=schedules#lesson-${cd?.lesson.id}`}
                    className="px-2 flex justify-center gap-2 items-center rounded-full cursor-pointer bg-slate-500 hover:bg-slate-600 text-white text-xs"
                  >
                    <span className="whitespace-nowrap">Xem mô tả</span>
                    <FaLink size={10} />
                  </Link>
                </Tooltip>
              )}
            </p>
            <p>
              Ngày học tiếp theo: <span className="font-bold">
                {cd?.classDate ? `${DateToStringWithoutTime(cd?.classDate)} \n` : "Không có \n"}
              </span>
              <br />
            </p>
            <p>
              Giảng viên: <span className="font-bold">{teacher}</span>
            </p>
            <p>
              Số học sinh:{" "}
              <span className="font-bold">{data.students.length}</span>
            </p>
            <p>
              Số bài học:{" "}
              <span className="font-bold">
                {
                  cds.filter(
                    (s) =>
                      s.classDate &&
                      new Date(s.classDate).getTime() < new Date().getTime()
                  ).length
                }
                /{data.classDays.length}
              </span>
            </p>
          </div>
        );
      }

      case "location": {
        const location = cd?.location;

        return (
          <p>{location ? `${location.branch} - ${location.room}` : "Không có"}</p>
        );
      }
      case "staff":
        const staff = cellValue as StaffDTO | null | undefined;

        return (
          <p className={`px-2 py-1 rounded-full`}>
            {staff ? `${staff.firstName} ${staff.lastName}` : "Không có"}
          </p>
        );
      case "Action":
        return (
          <div className="w-full relative flex justify-center">
            <ButtonGroup>
              <Button
                as={Link}
                isIconOnly
                href={`/classes/${data.code}`}
                disabled={loading}
                className="text-[#2255a6]"
              >
                <FaEye />
              </Button>
              <EditButton
                isIconOnly
                href={`/classes/${data.code}/edit`}
                disabled={loading}
                // className="text-[#2255a6]" // Thêm màu cho nút Edit
              />
              <DeleteActionButton
                action={deleteAction}
                objectName="Lớp học"
                afterDelete={() => {
                  router.refresh();
                }}
                id={data.id}
                isIconOnly={true}
              />
            </ButtonGroup>
          </div>
        );
    }
  };

  const rest: Rest | undefined = data;

  const filterOptions = getFilterOptions(selection, params, path, router);

  const renderCellTestDay = (key: string, data: DataType) => {
    if (key === "id") {
      return <p>{data[key].toString().split(" ")[1]}</p>;
    }
    if (key === "Test Type") {
      const value = data[key];

      if (value === "MIDTERM") {
        return (
          <p className="px-2 py-1 bg-orange-600 w-fit mx-auto  font-bold text-white rounded-full text-xs">
            Giữa kỳ
          </p>
        );
      }

      if (value === "FINAL") {
        return (
          <p className="px-2 py-1 bg-[#2255a6] w-fit mx-auto font-bold text-white rounded-full text-xs">
            Cuối kỳ
          </p>
        );
      }

      return (
        <p className="px-2 py-1 bg-gray-600 w-fit mx-auto font-bold text-white rounded-full text-xs">
          Ngày thường
        </p>
      );
    }

    return <p>{data[key]}</p>;
  };

  const columnsReportTestDay = [
    { name: "STT", key: "id" },
    { name: "Tên", key: "Name" },
    { name: "Ngày kiểm tra", key: "Test Date" },
    { name: "Loại kiểm tra", key: "Test Type" },
    { name: "Lịch học", key: "Schedule" },
    { name: "Địa điểm", key: "Location" },
  ];

  const columnsReportAbsence = [
    { name: "STT", key: "id" },
    { name: "Lớp đăng ký", key: "Enrolled Class" },
    { name: "Ngày vắng", key: "Absent Date" },
    { name: "Tên học sinh", key: "Student Name" },
    { name: "Biệt danh", key: "Nick Name" },
    { name: "Mô tả bài học", key: "Lesson Description" },
    { name: "Nhận xét", key: "Comment" },
    { name: "Bài tập về nhà", key: "Homework" },
  ];

  const reportButtons = [
    {
      label: "Xem báo cáo ngày kiểm tra",
      type: "testDay",
      url: "/api/report/test-day",
      title: "Báo cáo ngày kiểm tra",
      columns: columnsReportTestDay,
    },
    {
      label: "Xem báo cáo vắng mặt",
      type: "absence",
      url: "/api/report/absence",
      title: "Báo cáo vắng mặt",
      columns: columnsReportAbsence,
    },
  ];

  return (
    <>
      <TableWrapper<ClassDTO>
        rest={rest}
        columns={columns}
        renderCell={renderCell}
        data={data?.content}
        isLoading={loading}
        setFilterValue={() => { }}
        onNew={() => router.push("/classes/new")}
        filterOptions={filterOptions}
        filterValue={filterValue}
        isExport={exportToExcel}
        onChangePage={(page) => {
          const temp = structuredClone(classes);
          temp.content = [];
          temp.number = page;
          setPagingMetadata(temp);
        }}
        onPrint={[
          {
            label: "Báo cáo ngày kiểm tra",
            type: "testDay",
            icon: IoMdPrint,
            action: () => handleReportToggle("testDay"),
            color: "primary",
          },
          {
            label: "Báo cáo vắng mặt",
            type: "absence",
            icon: IoMdPrint,
            action: () => handleReportToggle("absence"),
            color: "primary",
          },
        ]}
      />

      {reportButtons.map(
        (report) =>
          activeReport === report.type && (
            <ReportViewer
              key={report.type}
              columns={report.columns}
              renderCell={
                renderCellTestDay as ComponentProps<
                  typeof ReportViewer
                >["renderCell"]
              }
              url={report.url}
              title={report.title}
              isOpen={isOpen}
              onClose={onClose}
            />
          )
      )}
    </>
  );
};

export default ClassTable;