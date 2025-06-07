export type StudentRequestDTO = {
    name: string;
    emailAddress?: string;
    nickname?: string;
    dateOfBirth: Date | string;
    phoneNumber: string;
    address?: string;
    note?: string;
    discountId?: number;
}