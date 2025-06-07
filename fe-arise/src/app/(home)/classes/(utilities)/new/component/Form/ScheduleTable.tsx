import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { StudentDTO } from "@/dtos";
import { AbsenceDTO } from "@/dtos/absence/AbsenceDTO";
import { ClassDayDTO } from "@/dtos/classDay/ClassDayDTO";
import { UpdateClassDayDTO } from "@/dtos/classDay/classDayDTORequest";
import { useMeaningfulContext } from "@/hooks";
import { getAllAbsenceByClass } from "@/services/AbsenceService";
import { updateClassDayInfo } from "@/services/ClassDayService";
import {
  DateToStringWithoutTime,
  mapDow
} from "@/utils/DateUtils";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import { Button, ButtonGroup, DatePicker } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import ApplyDownButton from "./ApplyDownButton";
import DropdownWrapper from "./DropdownContextProvider";
import { FormContext } from "./FormContext";
import LocationDropdown from "./LocationDropdown";
import ScheduleDropdown from "./ScheduleDropdown";
import StaffDropdown, { ROLES } from "./StaffDropdown";

type Props = {
  defaultClassDays?: ClassDayDTO[];
  classCode?: string;
  students?: StudentDTO[];
};

type IndexedClassDayDTO = {
  index: number;
} & ClassDayDTO;

export default function ScheduleTable({
  defaultClassDays,
  classCode,
  students,
}: Readonly<Props>) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(defaultClassDays ?? []);
  const [absence, setAbsence] = useState<AbsenceDTO[]>([]);

  const { schedules } = useMeaningfulContext(FormContext);

  useEffect(() => {
    const getStaff = async () => {
      const responseAbsence = await getAllAbsenceByClass(classCode);
      if (!responseAbsence.data) {
        toast.error("failed to fetch attendance");
        return;
      }
      setAbsence(responseAbsence.data);
    };

    getStaff();
  }, []);

  const [input, setInput] = useState<UpdateClassDayDTO>({
    id: -1,
  });

  const { id: currentEdit } = input;

  const onUpdate = async (classDay: ClassDayDTO, save: boolean = true) => {
    if (classDay.id !== currentEdit) {
      setInput({ id: classDay.id, classDate: classDay.classDate });
      return;
    }

    const body = {
      ...classDay,
      ...input,
    };

    if (
      body.classDate &&
      new Date(body.classDate).getDay() !==
      (mapDow(schedules?.find((s) => s.id === body.scheduleId)?.code) ??
        new Date(body.classDate).getDay())
    ) {
      toast.error("Schedule and date not match");
      return;
    }

    const temp = structuredClone(data);
    const index = temp.findIndex((t) => t.id === input.id);

    if (index === -1) {
      toast.error("Error updating class day");
      return;
    }
    setLoading(true);
    const response = await updateClassDayInfo(body);

    setLoading(false);
    if (!response.data) {
      toast.error("Error updating class day");
      return;
    }

    if (!save) {
      return response;
    }

    temp.splice(index, 1, response.data);

    setData(temp);
    setInput({
      id: -1,
    });
  };

  const updateTeacherDownward = async (index: number) => {
    const temp = structuredClone(data.slice(index + 1));
    const teacherId = input.teacherId;
    const itemToUpdate: UpdateClassDayDTO[] = temp
      .map((t) => ({
        ...t,
        teacherId,
      }))
      .filter((t) => t.teacherId !== t.teacher?.id);

    setLoading(true);
    const id = toast.loading(
      `Updating ${itemToUpdate.length + 1} teacher${itemToUpdate.length > 1 ? "s" : ""
      }...`
    );
    const response = await Promise.all([
      onUpdate(data[index], false),
      ...itemToUpdate.map((i) => updateClassDayInfo(i)),
    ]);
    setLoading(false);

    if (response.some((r) => !r?.data)) {
      toast.error("Error updating teacher");
      return;
    }

    const res = response.map((r) => r?.data).filter((r) => !!r);

    const tempData = structuredClone(data);
    const finalData = [...tempData.slice(0, index), ...res];

    setData(finalData);
    setInput({
      id: -1,
    });
    toast.dismiss(id);
    toast.success("Teacher updated successfully");
  };

  const updateLocationDownward = async (index: number) => {
    const temp = structuredClone(data.slice(index + 1));
    const locationId = input.locationId;
    const itemToUpdate: UpdateClassDayDTO[] = temp
      .map((t) => ({
        ...t,
        locationId,
      }))
      .filter((t) => t.locationId !== t.location?.id);

    const id = toast.loading(
      `Updating ${itemToUpdate.length + 1} location${itemToUpdate.length > 1 ? "s" : ""
      }...`
    );
    setLoading(true);
    const response = await Promise.all([
      onUpdate(data[index], false),
      ...itemToUpdate.map((i) => updateClassDayInfo(i)),
    ]);
    setLoading(false);

    if (response.some((r) => !r?.data)) {
      toast.error("Error updating teacher");
      return;
    }

    const res = response.map((r) => r?.data).filter((r) => !!r);

    const tempData = structuredClone(data);
    const finalData = [...tempData.slice(0, index), ...res];

    setData(finalData);
    setInput({
      id: -1,
    });
    toast.dismiss(id);
    toast.success("Location updated successfully");
  };

  const columns = [
    { name: "No.", key: "index" },
    { name: "Date", key: "date" },
    { name: "Schedule", key: "schedule" },
    { name: "Lesson description", key: "lesson_desc" },
    { name: "Teacher", key: "teacher" },
    { name: "Location", key: "location" },
    { name: "Attendance", key: "attendance" },
    { name: "Action", key: "action" },
  ];

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

  const renderAbsence = (data: ClassDayDTO) => {
    if (!absence || absence.length === 0) {
      return (
        <Button
          as={Link}
          href={`/classes/${classCode}/${data.id}/edit`}
          color="warning"
          size="sm"
        >
          Attendance
        </Button>
      );
    }

    const absencesForClassDay = absence.filter((a) => a.classDayId === data.id);
    const presencesCount = absencesForClassDay.filter(
      (a) => !a.checkAbsent
    ).length;

    return absencesForClassDay.length > 0 ? (
      <Button
        as={Link}
        href={`/classes/${classCode}/${data.id}`}
        color="primary"
        size="sm"
      >
        {presencesCount} / {students?.length ?? 0} Students
      </Button>
    ) : (
      <Button
        as={Link}
        href={`/classes/${classCode}/${data.id}/edit`}
        color="warning"
        size="sm"
      >
        Attendance
      </Button>
    );
  };

  const renderCell = (key: string, cd: IndexedClassDayDTO) => {
    switch (key) {
      case "index":
        return <p>{cd[key] + 1}</p>;
      case "date":
        return currentEdit === cd.id ? (
          <DatePicker
            isDisabled={loading}
            defaultValue={
              cd.classDate
                ? parseAbsolute(cd.classDate.toString(), getLocalTimeZone())
                : undefined
            }
            onChange={(v) =>
              setInput({
                ...input,
                classDate: v?.toDate(),
              })
            }
            hideTimeZone
            granularity="day"
            isRequired
            name="start_date"
            labelPlacement="outside"
            variant="bordered"
            size="sm"
          />
        ) : (
          <p>{cd.classDate ? DateToStringWithoutTime(cd.classDate) : "N/A"}</p>
        );
      case "lesson_desc":
        return (
          <p
            id={`lesson-${cd.lesson.id}`}
            className="text-left whitespace-pre-line max-w-[500px] target:animate-hightlight"
          >
            {cd.lesson.description}
          </p>
        );
      case "schedule":
        return currentEdit === cd.id ? (
          <DropdownWrapper
            disabled={loading}
            selectionMode="single"
            onChange={(o) => {
              if (o.length === 0) {
                toast.error("schedule is required");
                return false;
              }
              setInput({
                ...input,
                scheduleId: JSON.parse(o[0].value).id,
              });
              return true;
            }}
            label="schedules"
            defaultSelection={(cd.schedule ? [cd.schedule] : [])?.map((s) => ({
              key: s.code,
              value: JSON.stringify({ id: s.id, code: s.code }),
            }))}
            required
          >
            <ScheduleDropdown />
          </DropdownWrapper>
        ) :
          <span className="px-2 rounded-full bg-orange-500 text-white whitespace-nowrap">
            {cd.schedule?.code ?? "N/A"}
          </span>
          ;
      case "teacher":
        return currentEdit === cd.id ? (
          <DropdownWrapper
            disabled={loading}
            label="teacher"
            defaultLoading={false}
            defaultSelection={
              cd.teacher
                ? [
                  {
                    key: `${cd.teacher.firstName} ${cd.teacher.lastName}`,
                    value: cd.teacher.id.toString(),
                  },
                ]
                : undefined
            }
            onChange={(o) => {
              setInput({
                ...input,
                teacherId: o.length == 0 ? undefined : Number(o[0].value),
              });
              return true;
            }}
          >
            <StaffDropdown
              utilities={
                <ApplyDownButton
                  onApplyDownward={() => updateTeacherDownward(cd.index)}
                />
              }
              requiredRoles={[ROLES.TEACHER]}
              scheduleIds={(cd.schedule ? [cd.schedule] : []).map((s) => s.id)}
            />
          </DropdownWrapper>
        ) : cd.teacher ? (
          <p>
            {cd.teacher.firstName} {cd.teacher.lastName}
          </p>
        ) : (
          <p className="font-bold opacity-30">N/A</p>
        );
      case "location":
        return currentEdit === cd.id ? (
          <DropdownWrapper
            disabled={loading}
            label="location"
            defaultSelection={
              cd.location
                ? [
                  {
                    key: `${cd.location.branch} - ${cd.location.room}`,
                    value: cd.location.id.toString(),
                  },
                ]
                : undefined
            }
            onChange={(o) => {
              setInput({
                ...input,
                locationId: o.length == 0 ? undefined : Number(o[0].value),
              });
              return true;
            }}
          >
            <LocationDropdown
              utilities={
                <ApplyDownButton
                  onApplyDownward={() => updateLocationDownward(cd.index)}
                />
              }
              scheduleIds={(cd.schedule ? [cd.schedule] : []).map((s) => s.id)}
            />
          </DropdownWrapper>
        ) : cd.location ? (
          <p>
            {cd.location.branch} - {cd.location.room}
          </p>
        ) : (
          <p className="font-bold opacity-30">N/A</p>
        );
      case "action":
        return (
          <ButtonGroup>
            <Button
              isDisabled={loading}
              isIconOnly
              color={currentEdit === cd.id ? "success" : undefined}
              onPress={async () => await onUpdate(cd)}
            >
              {currentEdit === cd.id ? <FaSave /> : <FaPen />}
            </Button>
            {currentEdit === cd.id && (
              <Button
                isDisabled={loading}
                isIconOnly
                color="danger"
                onPress={() => setInput({ id: -1 })}
              >
                <MdCancel />
              </Button>
            )}
          </ButtonGroup>
        );
      case "attendance":
        return renderAbsence(cd);
      default:
        return undefined;
    }
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }
    const formattedData = data.map((classDay, index) => ({
      No: index + 1,
      Date: classDay.classDate
        ? DateToStringWithoutTime(classDay.classDate)
        : "N/A",
      Schedule: classDay.schedule?.code ?? "N/A",
      "Lesson description": classDay.lesson.description,
      Teacher: classDay.teacher
        ? classDay.teacher.firstName + " " + classDay.teacher.lastName
        : "N/A",
      Location: classDay.location?.branch + " - " + classDay.location?.room,
      Attendance: getAbsence(classDay),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Schedule-${classCode}`);

    XLSX.writeFile(workbook, `Schedule-${classCode}.xlsx`);
  };

  const getAbsence = (data: ClassDayDTO) => {
    if (!absence || absence.length === 0) {
      return "N/A";
    }

    const absencesForClassDay = absence.filter((a) => a.classDayId === data.id);
    const presencesCount = absencesForClassDay.filter(
      (a) => !a.checkAbsent
    ).length;

    return absencesForClassDay.length > 0
      ? `${presencesCount} / ${students?.length ?? 0} Students`
      : "0/0 Students";
  };

  return (
    <TableWrapper<IndexedClassDayDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data.map((c, i) => ({ index: i, ...c }))}
      isLoading={loading}
      showControls={false}
      isExport={exportToExcel}
    />
  );
}
