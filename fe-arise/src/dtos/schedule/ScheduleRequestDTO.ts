import { DayOfWeek } from "@/constants/dayOfWeek";

export type ScheduleRequestDTO = {
  description: string;
  startTime: Date;
  endTime: Date;
  dayOfWeek: DayOfWeek;
};
