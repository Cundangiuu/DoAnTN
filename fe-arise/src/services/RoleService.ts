"use server"

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base";
import { RoleDTO } from "@/dtos/staff/RoleDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllRoles = async (
  page?: number,
  size?: number,
): Promise<ApiResponse<Pageable<RoleDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/roles/${requestId}?page=${page}&size=${size}`,
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

      const data: Pageable<RoleDTO> =
        (await response.json()) as Pageable<RoleDTO>;

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
}