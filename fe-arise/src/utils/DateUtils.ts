import { ClassDayDTO } from "@/dtos/classDay/ClassDayDTO";
import { CalendarDate } from "@internationalized/date";

export default function DateToString(date: Date) {
  const dateStr = new Date(date).toString().split(" ").slice(0, 3).join(" ");
  const timeStr = new Date(date).toString().split(" ").slice(3, 5).join(" ");

  return {
    date: dateStr,
    time: timeStr,
  };
}

export function DateToStringWithoutTime(date: Date | null): string {
  if (!date) {
    throw new Error("Invalid date provided");
  }
  const validDate = date instanceof Date ? date : new Date(date);

  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid date provided");
  }

  const day = String(validDate.getDate());
  const month = String(validDate.getMonth() + 1);
  const year = validDate.getFullYear();

  return `${day}/${month}/${year}`;
}

export const IOStringToCalendarDate = (date: string) => {
  const dateObject = new Date(date);

  const calendarDate = new CalendarDate(
    dateObject.getFullYear(),
    dateObject.getMonth() + 1,
    dateObject.getDate()
  );

  return calendarDate;
};

export function mapDow(dow?: string) {
  switch (dow) {
    case "SU":
      return 0;
    case "MO":
      return 1;
    case "TU":
      return 2;
    case "WE":
      return 3;
    case "TH":
      return 4;
    case "FR":
      return 5;
    case "SA":
      return 6;
    default:
      return undefined;
  }
}

export function dowToString(dow: number) {
  switch (dow) {
    case 0:
      return "SU";
    case 1:
      return "MO";
    case 2:
      return "TU";
    case 3:
      return "WE";
    case 4:
      return "TH";
    case 5:
      return "FR";
    case 6:
      return "SA";
    default:
      return undefined;
  }
}

export function DateFromScheduleCode(code: string) {
  const time = code.split("-");

  return {
    dow: mapDow(time[0]),
  };
}

export function ScheduleCodeFromDate(
  classDay: Date,
  fromTime: Date,
  toTime: Date
) {
  const dow = new Date(classDay).getDay();

  const ft = new Date(fromTime).toISOString().split("T")[1].substring(0, 5);
  const tt = new Date(toTime).toISOString().split("T")[1].substring(0, 5);

  return [dow, ft, tt].join("-");
}

export function ClassDateToSchedule(data: ClassDayDTO) {
  if (!data.schedule) {
    throw new Error("Schedule is undefined");
  }
  const startTime = new Date(data.schedule.startTime);
  const endTime = new Date(data.schedule.endTime);

  const startHour = String(startTime.getHours()).padStart(2, "0");
  const startMinute = String(startTime.getMinutes()).padStart(2, "0");
  const endHour = String(endTime.getHours()).padStart(2, "0");
  const endMinute = String(endTime.getMinutes()).padStart(2, "0");

  const sc = `${dowToString(
    new Date(data.classDate!).getDay()
  )}-${startHour}${startMinute}-${endHour}${endMinute}`;

  return sc;
}
