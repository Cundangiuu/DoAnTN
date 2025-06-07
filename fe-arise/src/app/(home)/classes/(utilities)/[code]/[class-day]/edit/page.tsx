import { notFound } from "next/navigation";
import ClassDayForm from "../component/ClassDayForm";
import { getClassDayByCode } from "@/services/ClassDayService";
import { getStudentsByClassCode } from "@/services/StudentService";
import { getAllAbsence } from "@/services/AbsenceService";
import { StudentDTO } from "@/dtos";
import { AbsenceDTO } from "@/dtos/absence/AbsenceDTO";

export default async function ClassDayEdit({
  params,
}: Readonly<{ params: Promise<{ code: string; "class-day": number }> }>) {
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
      <ClassDayForm
        defaultClassDay={response.data}
        code={code}
        classDay={classDay}
        students={students}
      />
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
        avatar: student.avatarUrl || "",
        code: student.code,
        isAbsent: absentRecord ? !absentRecord.checkAbsent : false,
      };
    });
  }

  return (
    <ClassDayForm
      defaultClassDay={response.data}
      code={code}
      classDay={classDay}
      students={[]}
    />
  );
}
