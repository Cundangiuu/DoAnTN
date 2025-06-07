"use server";

import { auth } from "@/auth";
import { ENV } from "@/constants";
import { AbsenceDTO, AbsenceRequestDTO } from "@/dtos/absence/AbsenceDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const markAbsence = async (
  absence: AbsenceRequestDTO
): Promise<ApiResponse<AbsenceDTO>> => {
  const requestId = `${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  try {
    const response = await fetch(`${ENV.API_URL}/api/attendance/${requestId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-access-token": session.token.accessToken,
      },
      body: JSON.stringify(absence),
    });
    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.statusText,
      };
    }

    const data: AbsenceDTO = (await response.json()) as AbsenceDTO;
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

export const getAllAbsence = async (): Promise<ApiResponse<AbsenceDTO[]>> => {
  const requestId = `${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  try {
    const response = await fetch(`${ENV.API_URL}/api/attendance/${requestId}`, {
      method: "GET",
      headers: {
        "x-access-token": session.token.accessToken,
      },
    });
    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.statusText,
      };
    }

    const data: AbsenceDTO[] = (await response.json()) as AbsenceDTO[];
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

export const getAllAbsenceByStudent = async (
  studentCode: string
): Promise<ApiResponse<AbsenceDTO[]>> => {
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
      `${ENV.API_URL}/api/attendance/${requestId}/${studentCode}/student`,
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

    const data: AbsenceDTO[] = (await response.json()) as AbsenceDTO[];
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

export const getAllAbsenceByClass = async (
  classCode?: string
): Promise<ApiResponse<AbsenceDTO[]>> => {
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
      `${ENV.API_URL}/api/attendance/${requestId}/${classCode}/class`,
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

    const data: AbsenceDTO[] = (await response.json()) as AbsenceDTO[];
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

export const getAbsenceReport = async (
  from: Date,
  to: Date
): Promise<ApiResponse<Blob>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL
        }/api/attendance/absence-report/${requestId}?from=${from.toISOString()}&to=${to.toISOString()}`,
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
