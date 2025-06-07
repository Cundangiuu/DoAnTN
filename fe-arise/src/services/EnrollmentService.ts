"use server";
import { auth } from "@/auth";
import { ENV } from "@/constants";
import { EnrollmentDTO } from "@/dtos/enrollment/EnrollmentDTO";
import { EnrollmentRequest } from "@/dtos/requests/EnrollmentRequest";
import { ApiResponse } from "@/types";

export const getAllEnrollmentByCourse = async (
  courseId: string
): Promise<ApiResponse<EnrollmentDTO[]>> => {
  const requestId = crypto.randomUUID();
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const response = await fetch(
    `${ENV.API_URL}/api/enrollment/${requestId}/${courseId}`,
    {
      method: "GET",
      headers: {
        "x-access-token": session.token.accessToken,
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

  const blog = (await response.json()) as EnrollmentDTO[];

  return {
    status: response.status,
    message: response.statusText,
    data: blog,
  };
};

export const getAllEnrollmentByStudent = async (
  studentCode: string
): Promise<ApiResponse<EnrollmentDTO[]>> => {
  const requestId = crypto.randomUUID();
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const response = await fetch(
    `${ENV.API_URL}/api/enrollment/${requestId}/${studentCode}/student`,
    {
      method: "GET",
      headers: {
        "x-access-token": session.token.accessToken,
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

  const blog = (await response.json()) as EnrollmentDTO[];

  return {
    status: response.status,
    message: response.statusText,
    data: blog,
  };
};

export const createEnrollment = async (
  enrollmentRequest: EnrollmentRequest[]
): Promise<ApiResponse<EnrollmentDTO[]>> => {
  const requestId = `add-enrollment-${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const response = await fetch(`${ENV.API_URL}/api/enrollment/${requestId}`, {
    method: "POST",
    headers: {
      "x-access-token": session.token.accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enrollmentRequest),
    cache: "no-store",
  });

  if (response.status !== 200) {
    return {
      status: response.status,
      message: response.statusText,
    };
  }

  const data = (await response.json()) as EnrollmentDTO[];

  return {
    status: response.status,
    message: response.statusText,
    data: data,
  };
};

export const updateEnrollment = async (
  enrollmentRequest: EnrollmentRequest,
  enrollmentId: number
): Promise<ApiResponse<EnrollmentDTO>> => {
  const requestId = `update-enrollment-${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  const response = await fetch(
    `${ENV.API_URL}/api/enrollment/${requestId}/${enrollmentId}`,
    {
      method: "PUT",
      headers: {
        "x-access-token": session.token.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollmentRequest),
      cache: "no-store",
    }
  );

  if (response.status !== 200) {
    return {
      status: response.status,
      message: response.statusText,
    };
  }

  const data = (await response.json()) as EnrollmentDTO;

  return {
    status: response.status,
    message: response.statusText,
    data: data,
  };
};

export const deleteEnrollment = async (
  enrollmentId: number
): Promise<ApiResponse<EnrollmentDTO>> => {
  const requestId = `update-lesson-${crypto.randomUUID()}`;
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const response = await fetch(
    `${ENV.API_URL}/api/enrollment/${requestId}/${enrollmentId}`,
    {
      method: "DELETE",
      headers: {
        "x-access-token": session.token.accessToken,
        "Content-Type": "application/json",
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

  const data = (await response.json()) as EnrollmentDTO;

  return {
    status: response.status,
    message: response.statusText,
    data: data,
  };
};
