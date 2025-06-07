export type StaffRequestDTO = {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    weeklyHours: number;
    rates: number;
    scheduleIds: number[];
    courseIds: number[];
    roleIds: number[];
}