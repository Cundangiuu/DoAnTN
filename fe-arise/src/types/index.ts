export * from "./ApiResponse";

export type Params = Promise<{ slug: string }>;
export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export type OmitNullish<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};
