export type AbsenceRequestDTO = {
  studentId: number;
  classCode: string;
  classDayId: number;
  checkAbsent: boolean;
};

export type AbsenceDTO = {
    id: number;
    studentId: number;
    classCode: string;
    classDayId: number;
    classDate: Date;
    checkAbsent: boolean;
}
