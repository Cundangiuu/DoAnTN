export type ClassDayDTORequest = {
  comment: string;
  homework: string;
  rating: number;
};

export type UpdateClassDayDTO = {
  id: number;
  classDate?: Date;
  teacherId?: number;
  locationId?: number;
  scheduleId?: number;
};
