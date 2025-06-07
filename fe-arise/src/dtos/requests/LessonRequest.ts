export enum TypeOfLesson {
  MIDTERM = "MIDTERM",
  FINAL = "FINAL",
}
export type LessonRequest = {
  courseId: string;
  description: string;
  lessonType: TypeOfLesson | null;
};
