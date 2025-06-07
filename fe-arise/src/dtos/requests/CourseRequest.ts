import { CourseLevelConstants } from "@/constants/course";

export type CourseRequest = {
  name: string;
  tuitionRate: number;
  numberHour: number;
  courseLevelConstants: CourseLevelConstants;
  description: string;
};
