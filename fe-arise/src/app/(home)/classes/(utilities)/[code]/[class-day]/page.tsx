import { StudentDTO } from "@/dtos";
import { AbsenceDTO } from "@/dtos/absence/AbsenceDTO";
import { getAllAbsence } from "@/services/AbsenceService";
import { getClassDayByCode } from "@/services/ClassDayService";
import { getStudentsByClassCode } from "@/services/StudentService";
import DateToString, { DateToStringWithoutTime } from "@/utils/DateUtils";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClassDayForm from "./component/ClassDayForm";

type Props = {
  params: Promise<{ code: string; "class-day": number }>;
};

export default async function AttendancePage({ params }: Readonly<Props>) {
  const { code, "class-day": classDay } = await params;

  const response = await getClassDayByCode(classDay);
  const studentResponse = await getStudentsByClassCode(code);
  const absentList = await getAllAbsence();

  if (!response.data) {
    notFound();
  }

  if (studentResponse.data && absentList.data) {
    const students = mapStudentsWithAbsence(
      studentResponse.data,
      absentList.data
    );
    return (
      <>
        <div className="w-full mb-3 flex gap-3 justify-between">
          <h1 className="text-2xl font-bold">
            {response.data.classDate
              ? DateToString(response.data.classDate).date
              : "N/A"}
          </h1>
          <Button
            as={Link}
            href={`/classes/${code}/${classDay}/edit`}
            color="primary"
            type="button"
          >
            Edit
          </Button>
        </div>
        <ClassDayForm
          isReadonly
          isDisabled
          defaultClassDay={response.data}
          code={code}
          classDay={classDay}
          students={students}
        />
      </>
    );
  }

  function mapStudentsWithAbsence(
    students: StudentDTO[],
    absences: AbsenceDTO[]
  ) {
    return students.map((student: StudentDTO) => {
      const absentRecord = absences?.find(
        (absence: AbsenceDTO) =>
          absence.studentId === student.id &&
          absence.classCode === code &&
          absence.classDayId === Number(classDay)
      );
      return {
        id: student.id,
        name: student.name,
        nickname: student.nickname || "",
        avatar: student.avatarUrl || null,
        code: student.code,
        isAbsent: absentRecord ? !absentRecord.checkAbsent : false,
      };
    });
  }

  return (
    <>
      <div className="w-full mt-8 flex gap-3 justify-between bg-black">
        <h1 className="text-2xl font-bold">
          {response.data.classDate
            ? DateToStringWithoutTime(response.data.classDate)
            : "N/A"}
        </h1>
        <Button
          as={Link}
          href={`/classes/${code}/${classDay}/edit`}
          color="primary"
          type="button"
        >
          Edit
        </Button>
      </div>
      <ClassDayForm
        isReadonly
        defaultClassDay={response.data}
        code={code}
        classDay={classDay}
        students={[]}
      />
    </>
  );
}
