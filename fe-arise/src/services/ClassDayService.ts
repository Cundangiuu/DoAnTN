"use server";

import { auth } from "@/auth";
import { ENV } from "@/constants";

import { ClassDayDTO } from "@/dtos/classDay/ClassDayDTO";
import {
  ClassDayDTORequest,
  UpdateClassDayDTO,
} from "@/dtos/classDay/classDayDTORequest";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getClassDayByCode = async (
  classCode: number
): Promise<ApiResponse<ClassDayDTO>> => {
  const requestId = `${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  try {
    const response = await fetch(
      `${ENV.API_URL}/api/class-day/${requestId}/${classCode}`,
      {
        method: "GET",
        headers: {
          "x-access-token": session.token.accessToken,
        },
      }
    );
    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.statusText,
      };
    }

    const data: ClassDayDTO = (await response.json()) as ClassDayDTO;
    return {
      status: response.status,
      message: response.statusText,
      data,
    };
  } catch (e) {
    console.log(e);
    return { message: "Failed to fetch", status: 500 };
  }
};

export const updateClassDay = async (
  classCode: number,
  updateClassDayDTO: ClassDayDTORequest
): Promise<ApiResponse<ClassDayDTO>> => {
  const requestId = `${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  try {
    const response = await fetch(
      `${ENV.API_URL}/api/class-day/${requestId}/${classCode}`,
      {
        method: "PUT",
        body: JSON.stringify(updateClassDayDTO),
        headers: {
          "content-type": "application/json",
          "x-access-token": session.token.accessToken,
        },
      }
    );
    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.statusText,
      };
    }

    const data: ClassDayDTO = (await response.json()) as ClassDayDTO;
    return {
      status: response.status,
      message: response.statusText,
      data,
    };
  } catch (e) {
    console.log(e);
    return { message: "Failed to fetch", status: 500 };
  }
};

export const updateClassDayInfo = async (
  updateClassDayDTO: UpdateClassDayDTO
): Promise<ApiResponse<ClassDayDTO>> => {
  const requestId = `${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  try {
    const response = await fetch(`${ENV.API_URL}/api/class-day/${requestId}`, {
      method: "PUT",
      body: JSON.stringify(updateClassDayDTO),
      headers: {
        "content-type": "application/json",
        "x-access-token": session.token.accessToken,
      },
    });
    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.statusText,
      };
    }

    const data: ClassDayDTO = (await response.json()) as ClassDayDTO;
    return {
      status: response.status,
      message: response.statusText,
      data,
    };
  } catch (e) {
    console.log(e);
    return { message: "Failed to fetch", status: 500 };
  }
};

export const getReport = async (
  from: Date,
  to: Date
): Promise<ApiResponse<Blob>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL
        }/api/class-day/test-day-report/${requestId}?from=${from.toISOString()}&to=${to.toISOString()}`,
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
          data: undefined,
        };
      }

      const data = await response.blob();
      return {
        status: response.status,
        message:
          response.headers.get("Content-Disposition") ??
          "attachment; filename=test-day-report.jpeg;",
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};
