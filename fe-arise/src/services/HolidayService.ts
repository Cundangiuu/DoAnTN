"use server"

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base";
import { HolidayDTO } from "@/dtos/holiday/HolidayDTO";
import { HolidayRequestDTO } from "@/dtos/holiday/HolidayRequestDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllHolidays = async (page?: number, size?: number): Promise<ApiResponse<Pageable<HolidayDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/holiday-schedules/${requestId}?page=${page}&size=${size}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }
      const holidays = (await response.json()) as Pageable<HolidayDTO>;


      return {
        status: response.status,
        message: response.statusText,
        data: holidays,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  })
}

export const getHoliday = async (id: number): Promise<ApiResponse<HolidayDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/holiday-schedules/${requestId}/${id}`,
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

      const holiday: HolidayDTO = (await response.json()) as HolidayDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: holiday,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
}

export const createHoliday = async (holiday: HolidayRequestDTO): Promise<ApiResponse<HolidayDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/holiday-schedules/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(holiday),
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }
      const data = (await response.json()) as HolidayDTO;

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
}

export const updateHoliday = async (id: number, holiday: HolidayRequestDTO): Promise<ApiResponse<HolidayDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/holiday-schedules/${requestId}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(holiday),
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as HolidayDTO;

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
}

export const deleteHoliday = async (id: number): Promise<ApiResponse<HolidayDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/holiday-schedules/${requestId}/${id}`,
        {
          method: "DELETE",
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      return {
        status: response.status,
        message: response.statusText,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  })
}