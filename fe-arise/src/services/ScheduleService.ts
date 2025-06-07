"use server";

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base";
import { ScheduleDTO } from "@/dtos/schedule/ScheduleDTO";
import { ScheduleRequestDTO } from "@/dtos/schedule/ScheduleRequestDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllSchedules = async (
  page?: number,
  size?: number
): Promise<ApiResponse<Pageable<ScheduleDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/schedules/${requestId}?page=${page}&size=${size}`,
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

      const schedules = (await response.json()) as Pageable<ScheduleDTO>;

      return {
        status: response.status,
        message: response.statusText,
        data: schedules,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const getSchedule = async (
  id: number
): Promise<ApiResponse<ScheduleDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/schedules/${requestId}/${id}`,
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

      const student: ScheduleDTO = (await response.json()) as ScheduleDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: student,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const createSchedule = async (
  bodyData: ScheduleRequestDTO
): Promise<ApiResponse<ScheduleDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/schedules/${requestId}`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
          cache: "no-store",
        }
      );

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as ScheduleDTO;

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

export const updateSchedule = async (
  bodyData: ScheduleRequestDTO,
  dataId: number
): Promise<ApiResponse<ScheduleDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/schedules/${requestId}/${dataId}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
          cache: "no-store",
        }
      );

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as ScheduleDTO;

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

export const deleteSchedule = async (
  id: number
): Promise<ApiResponse<ScheduleDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/schedules/${requestId}/${id}`,
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

      const data = (await response.json()) as ScheduleDTO;

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
