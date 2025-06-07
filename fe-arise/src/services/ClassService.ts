"use server";

import { auth } from "@/auth";
import { ENV } from "@/constants";
import { ClassStatus } from "@/constants/class";
import { Pageable } from "@/dtos/base";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { CreateClassDTO, UpdateClassDTO } from "@/dtos/classes/ClassRequestDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllClasses = async (
  page: number,
  size: number,
  status?: ClassStatus,
  staffId?: number,
  searchString: string = ""
): Promise<ApiResponse<Pageable<ClassDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(
        `${ENV.API_URL
        }/api/classes/${requestId}?page=${page}&size=${size}&searchString=${searchString}${status ? `&status=${status}` : ""
        }${staffId ? `&staffId=${staffId}` : ""}`,
        {
          method: "GET",
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

      const classes: Pageable<ClassDTO> =
        (await response.json()) as Pageable<ClassDTO>;

      return {
        status: response.status,
        message: response.statusText,
        data: classes,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const createClass = async (
  createClassDTO: CreateClassDTO
): Promise<ApiResponse<ClassDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/classes/${requestId}`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
        body: JSON.stringify(createClassDTO),
      });
      if (response.status !== 200) {

        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: ClassDTO = (await response.json()) as ClassDTO;

      return {
        status: response.status,
        message: response.statusText,
        data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const updateClass = async (
  id: number,
  updateClassDTO: UpdateClassDTO
): Promise<ApiResponse<ClassDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/classes/${requestId}/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(updateClassDTO),
          headers: {
            "content-type": "application/json",
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

      const data: ClassDTO = (await response.json()) as ClassDTO;

      return {
        status: response.status,
        message: response.statusText,
        data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const deleteClass = async (
  classId: number
): Promise<ApiResponse<void>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/classes/${requestId}/${classId}`,
        {
          headers: {
            "x-access-token": token,
          },
          method: "DELETE",
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
  });
};

export const getClassByCode = async (
  classCode: string
): Promise<ApiResponse<ClassDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/classes/${requestId}/${classCode}`,
        {
          method: "GET",
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

      const data: ClassDTO = (await response.json()) as ClassDTO;
      return {
        status: response.status,
        message: response.statusText,
        data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to fetch", status: 500 };
    }
  });
};

export const getTotalClass = async (): Promise<ApiResponse<number>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/classes/${requestId}/total`,
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

      const data: number = (await response.json()) as number;

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

const parseStatus = (status: string) => {
  return status === "all" ? undefined : status;
};

export const classQuery = async (
  page: number,
  size: number,
  currentView?: string,
  searchString?: string,
  status?: string
): Promise<ApiResponse<Pageable<ClassDTO>>> => {
  const session = await auth();
  if (!session) {
    return {
      message: "User not authenticated",
      status: 401,
    };
  }

  const { userId } = session;

  if (currentView === "all-classes") {
    return await getAllClasses(
      page,
      size,
      parseStatus(status as string) as ClassStatus,
      undefined,
      searchString
    );
  }
  if (!userId) {
    return {
      message: "User ID is not available.",
      status: 400,
    };
  }

  return await getAllClasses(
    page,
    size,
    parseStatus(status as string) as ClassStatus,
    Number(userId),
    searchString
  );
};
