"use client";

import { SubmitButton } from "@/components/molecules/form";
import { useMeaningfulContext } from "@/hooks";
import { createClass, updateClass } from "@/services/ClassService";
import { DateFromScheduleCode } from "@/utils/DateUtils";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import { DatePicker, Input, Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ClassInfoContext } from "../../../context/ClassInfoContext";
import CoursesDropdown from "./CourseDropdown";
import DropdownWrapper, { OptionProps } from "./DropdownContextProvider";
import GradesTable from "./GradesTable";
import ScheduleDropdown from "./ScheduleDropdown";
import ScheduleTable from "./ScheduleTable";
import StaffDropdown, { ROLES } from "./StaffDropdown";
import StudentTable from "./StudentTable";

type Props = {
  title?: string;
  isDisabled?: boolean;
  isReadonly?: boolean;
  operation?: "create" | "update";
  showSchedule?: boolean;
  showGrades?: boolean;
};

export default function Form({
  isDisabled,
  isReadonly,
  title,
  operation,
  showGrades = true,
  showSchedule = true,
}: Readonly<Props>) {
  const router = useRouter();
  const path = usePathname();
  const { defaultClass: defaultClassInit } = useMeaningfulContext(ClassInfoContext)
  const defaultClassPrep = defaultClassInit;

  const [schedules, setSchedules] = useState<OptionProps[] | undefined>(
    defaultClassPrep?.schedules.map((s) => ({
      key: s.code,
      value: JSON.stringify({ id: s.id, code: s.code }),
    }))
  );
  const [className, setClassName] = useState<string | undefined>(
    defaultClassPrep?.name
  );
  const [date, setDate] = useState(
    defaultClassPrep && defaultClassPrep.startDate
      ? parseAbsolute(defaultClassPrep.startDate, getLocalTimeZone())
      : null
  );
  const [course, setCourse] = useState(
    defaultClassPrep
      ? [
        {
          key: defaultClassPrep.course.name,
          value: defaultClassPrep.course.id.toString(),
        },
      ]
      : undefined
  );

  const [staff, setStaff] = useState(
    defaultClassPrep
      ? [
        {
          key: `${defaultClassPrep.staff.firstName} ${defaultClassPrep.staff.lastName}`,
          value: defaultClassPrep.staff.id.toString(),
        },
      ]
      : undefined
  );

  const [studentIds, setStudentIds] = useState(
    defaultClassPrep?.students.map((s) => s.id)
  );

  const searchParams = useSearchParams();
  const [tabSelected, setTabSelected] = useState(searchParams.get("view"));
  const onSubmit = async (formData: FormData) => {
    const startDate = date?.toDate();

    if (!startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!className) {
      toast.error("Class name is required");
      return;
    }

    const schedules = (
      JSON.parse(formData.get("schedules") as string) as string[]
    ).map((s) => JSON.parse(s) as { code: string; id: number });
    if (schedules.length < 2) {
      toast.error("Required at least 2 schedules set for a class");
      return;
    }
    const scheduleIds = schedules.map((s) => s.id);
    const courseId =
      course && course.length > 0 ? Number(course[0].value) : undefined;

    if (!courseId) {
      toast.error("Course is required");
      return;
    }

    if (!staff || staff.length < 1) {
      toast.error("Staff is required");
      return;
    }

    const staffId = staff.map((s) => Number(s.value))[0];

    const dow = startDate.getDay();
    const dates = schedules.map((s) => DateFromScheduleCode(s.code));

    if (dates.every((d) => dow !== d.dow)) {
      toast.error("Date does not match schedule");
      return;
    }

    let response;

    if (operation === "update") {
      if (!defaultClassPrep?.id) {
        toast.error("Class not found");
        return;
      }

      response = await updateClass(defaultClassPrep.id, {
        startDate,
        className,
        studentIds: studentIds ?? [],
        scheduleIds,
        staffId,
      });
    } else {
      response = await createClass({
        className,
        studentIds: studentIds ?? [],
        scheduleIds,
        courseId,
        startDate,
        staffId,
      });
    }

    if (!response.data) {
      toast.error(`Failed to ${operation} class`);
      return;
    }

    toast.success(`Class ${operation}d`);
    router.push(`/classes/${response.data.code}`);
  };

  return (
    <form action={onSubmit}>
      <div className="w-full flex gap-3 justify-between">
        <h1 className="font-bold uppercase">{title}</h1>
        {!(isDisabled || isReadonly) && <SubmitButton />}
      </div>
      <div className="w-full flex gap-3 items-end">
        <Input
          isReadOnly={isReadonly}
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          name="name"
          isRequired
          label="Name"
          placeholder="John Doe"
          labelPlacement="outside"
          variant="bordered"
          size="sm"
          isClearable
          classNames={{
            base: "w-1/4",
          }}
        />
        <DatePicker
          onChange={(v) => setDate(v)}
          hideTimeZone
          granularity="day"
          isRequired
          value={date}
          isReadOnly={isReadonly}
          name="start_date"
          label="Start Date"
          labelPlacement="outside"
          variant="bordered"
          className="w-1/4"
          size="sm"
        />
      </div>
      <div className="w-full flex gap-3 items-end mt-2">
        <DropdownWrapper
          label="courses"
          defaultLoading
          required
          isReadonly={isReadonly}
          onChange={(selected) => {
            setCourse(selected);
            return true;
          }}
          defaultSelection={course}
        >
          <CoursesDropdown />
        </DropdownWrapper>
        <DropdownWrapper
          isReadonly={isReadonly}
          label="schedules"
          onChange={(selected) => {
            setSchedules(selected);
            return true;
          }}
          defaultSelection={schedules}
          required
          selectionMode="multiple"
        >
          <ScheduleDropdown />
        </DropdownWrapper>
        <DropdownWrapper
          isReadonly={isReadonly}
          defaultLoading
          label="academic staff"
          defaultSelection={staff}
          onChange={(selected) => {
            setStaff(selected);
            return true;
          }}
          required
        >
          <StaffDropdown requiredRoles={[ROLES.ACADEMIC_STAFF]} />
        </DropdownWrapper>
      </div>
      <div className="w-full flex gap-3 flex-col mt-8 bg-slate-50 p-4 rounded-md">
        <Tabs
          aria-label="Infos"
          color="primary"
          selectedKey={tabSelected}
          defaultSelectedKey={searchParams.get("view") ?? undefined}
          onSelectionChange={(key) => {
            const sp = new URLSearchParams(searchParams.toString());
            sp.set("view", key.toString());
            router.push(`${path}?${sp.toString()}`);
            setTabSelected(key.toString());
          }}
        >
          <Tab key={"students"} title={"Students"}>
            <StudentTable
              classCode={defaultClassPrep?.code}
              classId={defaultClassPrep?.id}
              onChange={(selected) => setStudentIds(selected)}
              isReadonly={isReadonly}
              defaultStudents={defaultClassPrep?.students}
            />
          </Tab>
          {showSchedule && (
            <Tab key={"schedules"} title={"Schedules"}>
              <ScheduleTable
                defaultClassDays={defaultClassPrep?.classDays}
                classCode={defaultClassPrep?.code}
                students={defaultClassPrep?.students}
              />
            </Tab>
          )}
          {showGrades && (
            <Tab key={"grades"} title={"Grades"}>
              <GradesTable
                classCode={defaultClassPrep?.code}
                classData={defaultClassPrep}
              />
            </Tab>
          )}
        </Tabs>
      </div>
    </form>
  );
}
