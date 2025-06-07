"use server"

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base";
import { LocationDTO } from "@/dtos/location/LocationDTO";
import { LocationRequestDTO } from "@/dtos/location/LocationRequestDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllLocations = async (page?: number,
  size?: number): Promise<ApiResponse<Pageable<LocationDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/locations/${requestId}?page=${page}&size=${size}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "x-access-token": token,
          }
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as Pageable<LocationDTO>;

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

export const getLocation = async (id: number): Promise<ApiResponse<LocationDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/locations/${requestId}/${id}`,
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

      const student: LocationDTO = (await response.json()) as LocationDTO;

      return {
        status: response.status,
        message: response.statusText,
        data: student,
      };
    } catch (e) {
      console.log(e)
      return { message: "Failed to fetch", status: 500 };
    }
  });
}

export const createLocation = async (bodyData: LocationRequestDTO): Promise<ApiResponse<LocationDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {

      const response = await fetch(
        `${ENV.API_URL}/api/settings/locations/${requestId}`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json"
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

      const data = (await response.json()) as LocationDTO;

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

export const updateLocation = async (bodyData: LocationRequestDTO, dataId: number): Promise<ApiResponse<LocationDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {

      const response = await fetch(
        `${ENV.API_URL}/api/settings/locations/${requestId}/${dataId}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json"
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

      const data = (await response.json()) as LocationDTO;

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

export const deleteLocation = async (id: number): Promise<ApiResponse<LocationDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/locations/${requestId}/${id}`,
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