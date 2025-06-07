"use server";

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base";
import { DiscountDTO } from "@/dtos/discount/DiscountDTO";
import { DiscountRequestDTO } from "@/dtos/discount/DiscountRequestDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllDiscounts = async (
  page?: number,
  size?: number
): Promise<ApiResponse<Pageable<DiscountDTO>>> => {
  return withAuth(async (token) => {

    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/discounts/${requestId}?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "x-access-token": token,
          },
          cache: "no-store",
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const discounts = (await response.json()) as Pageable<DiscountDTO>;

      return {
        status: response.status,
        message: response.statusText,
        data: discounts,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  })
};

export const getDiscount = async (
  id: number
): Promise<ApiResponse<DiscountDTO>> => {
  return withAuth(async (token) => {

    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/discounts/${requestId}/${id}`,
        {
          method: "GET",
          headers: {
            "x-access-token": token,
          },
          cache: "no-store",
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: DiscountDTO = (await response.json()) as DiscountDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const createDiscount = async (
  discountData: DiscountRequestDTO
): Promise<ApiResponse<DiscountDTO>> => {
  return withAuth(async (token) => {

    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/discounts/${requestId}`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discountData),
        cache: "no-store",
      });

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as DiscountDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const updateDiscount = async (
  discountData: DiscountRequestDTO,
  discountId: number
): Promise<ApiResponse<DiscountDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/discounts/${requestId}/${discountId}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(discountData),
          cache: "no-store",
        }
      );

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as DiscountDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  })
};


export const deleteDiscount = async (
  id: number
): Promise<ApiResponse<DiscountDTO>> => {
  return withAuth(async (token) => {

    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/discounts/${requestId}/${id}`,
        {
          method: "DELETE",
          headers: {
            "x-access-token": token,
          },
          cache: "no-store",
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const student: DiscountDTO = (await response.json()) as DiscountDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: student,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  })
};