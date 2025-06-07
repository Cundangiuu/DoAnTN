"use server";

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base";
import { StaffDTO } from "@/dtos/staff/StaffDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllStaffs = async (
  page?: number,
  size?: number
): Promise<ApiResponse<Pageable<StaffDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/staffs/${requestId}?page=${page}&size=${size}`,
        {
          method: "GET",
          cache: "no-store",
          headers: { "x-access-token": token },
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: Pageable<StaffDTO> =
        (await response.json()) as Pageable<StaffDTO>;

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

export const getFilteredStaffs = async (
  page?: number,
  size?: number,
  params?: {
    query?: string;
    roleIds?: number[];
    scheduleIds?: number[];
  }
): Promise<ApiResponse<Pageable<StaffDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const query = params?.query ? `&query=${params.query}` : "";
      const roleIds = params?.roleIds
        ? `&roleIds=${params.roleIds.join("&roleIds=")}`
        : "";
      const scheduleIds = params?.scheduleIds
        ? `&scheduleIds=${params.scheduleIds.join("&scheduleIds=")}`
        : "";


      const response = await fetch(
        `${ENV.API_URL}/api/settings/staffs/filtered/${requestId}?page=${page}&size=${size}${query}${roleIds}${scheduleIds}`,
        {
          method: "GET",
          cache: "no-store",
          headers: { "x-access-token": token },
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: Pageable<StaffDTO> =
        (await response.json()) as Pageable<StaffDTO>;

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

export const getStaff = async (
  staffId: number
): Promise<ApiResponse<StaffDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/staffs/${requestId}/${staffId}`,
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

      const data: StaffDTO = (await response.json()) as StaffDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch staff", status: 500 };
    }
  });
};

export const createStaff = async (
  staffFormData: FormData
): Promise<ApiResponse<StaffDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/staffs/${requestId}`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
          },
          body: staffFormData,
          cache: "no-store",
        }
      );

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: StaffDTO = (await response.json()) as StaffDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to create staff", status: 500 };
    }
  });
};

export const updateStaff = async (
  staffFormData: FormData,
  staffId: number
): Promise<ApiResponse<StaffDTO>> => {
  return withAuth(async (token) => {
    try {
      const requestId = `${crypto.randomUUID()}`;
      const response = await fetch(
        `${ENV.API_URL}/api/settings/staffs/${requestId}/${staffId}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
          },
          body: staffFormData,
          cache: "no-store",
        }
      );

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: StaffDTO = (await response.json()) as StaffDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to update staff", status: 500 };
    }
  });
};

export const deleteStaff = async (
  staffId: number
): Promise<ApiResponse<StaffDTO>> => {
  return withAuth(async (token) => {
    try {
      const requestId = `${crypto.randomUUID()}`;
      const response = await fetch(
        `${ENV.API_URL}/api/settings/staffs/${requestId}/${staffId}`,
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

      const data: StaffDTO = (await response.json()) as StaffDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to delete staff", status: 500 };
    }
  });
};
