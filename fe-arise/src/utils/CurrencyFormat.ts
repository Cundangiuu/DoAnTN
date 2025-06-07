export const formatToVND = (value: number | string): string => {
  const numericValue =
    typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) : value;
  return numericValue.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
