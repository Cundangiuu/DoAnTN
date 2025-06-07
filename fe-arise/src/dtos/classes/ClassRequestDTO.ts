export type CreateClassDTO = {
  startDate: Date;
  scheduleIds: number[];
  className: string;
  courseId: number;
  studentIds: number[];
  staffId: number;
};

export type UpdateClassDTO = {
  startDate: Date;
  className: string;
  studentIds: number[];
  scheduleIds: number[];
  staffId: number;
};
