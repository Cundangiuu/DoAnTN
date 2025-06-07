export type AddTokenDTO = {
  code: string;
  refreshToken: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
};
