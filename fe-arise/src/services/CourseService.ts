"use server";
import { auth } from "@/auth";
import { ENV } from "@/constants";
import { CourseLevelConstants } from "@/constants/course";
import { Pageable } from "@/dtos/base";
import { CourseDTO, CourseExportDTO } from "@/dtos/course";
import { CourseRequest } from "@/dtos/requests/CourseRequest";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getFullCourse = async (): Promise<ApiResponse<CourseDTO[]>> => {
  return withAuth(async (token) => {
    const requestId = `get-full-course-${crypto.randomUUID()}`;
    const response = await fetch(
      `${ENV.API_URL}/api/courses/${requestId}/get-full`,
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
    const courses = (await response.json()) as CourseDTO[];
    return {
      status: response.status,
      message: response.statusText,
      data: courses,
    };
  });
}

export const getAllCourse = async (
  page: number = 0,
  size: number = 10,
  sort: string[] = [],
  level?: CourseLevelConstants[],
  search?: string
): Promise<ApiResponse<Pageable<CourseDTO>>> => {
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const requestId = `get-all-course-${crypto.randomUUID()}`;
  const response = await fetch(
    `${ENV.API_URL
    }/api/courses/${requestId}/getAll?page=${page}&size=${size}&sort=${sort}${level ? `&level=${level}` : ""
    }${search ? `&courseCode=${search}` : ""}`,
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
  const blog = (await response.json()) as Pageable<CourseDTO>;
  return {
    status: response.status,
    message: response.statusText,
    data: blog,
  };
};

export const getCourseExport = async (
  level?: CourseLevelConstants[],
  search?: string
): Promise<ApiResponse<CourseExportDTO[]>> => {
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const requestId = `get-all-course-${crypto.randomUUID()}`;
  const response = await fetch(
    `${ENV.API_URL}/api/courses/${requestId}/export?${level ? `&level=${level}` : ""
    }${search ? `&courseCode=${search}` : ""}`,
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
  const blog = (await response.json()) as CourseExportDTO[];
  return {
    status: response.status,
    message: response.statusText,
    data: blog,
  };
};

export const deleteCourseById = async (
  courseCode: string
): Promise<ApiResponse<CourseDTO>> => {
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const requestId = `delete-course-${crypto.randomUUID()}`;

  const response = await fetch(
    `${ENV.API_URL}/api/courses/${requestId}/${courseCode}`,
    {
      method: "DELETE",
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

  const data = (await response.json()) as CourseDTO;

  return {
    status: response.status,
    message: response.statusText,
    data: data,
  };
};

export const getCourseById = async (
  courseCode: string
): Promise<ApiResponse<CourseDTO>> => {
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
      `${ENV.API_URL}/api/courses/${requestId}/${courseCode}`,
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

    const blog = (await response.json()) as CourseDTO;

    return {
      status: response.status,
      message: response.statusText,
      data: blog,
    };
  } catch (e) {
    console.log(e);

    return { message: "Failed to fetch", status: 500 };
  }
};

export const addCourse = async (
  courseRequest: CourseRequest
): Promise<ApiResponse<CourseDTO>> => {
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const requestId = `add-course-${crypto.randomUUID()}`;
  const response = await fetch(`${ENV.API_URL}/api/courses/${requestId}`, {
    method: "POST",
    headers: {
      "x-access-token": session.token.accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseRequest),
    cache: "no-store",
  });

  if (response.status !== 200) {
    return {
      status: response.status,
      message: response.statusText,
    };
  }

  const data = (await response.json()) as CourseDTO;

  return {
    status: response.status,
    message: response.statusText,
    data: data,
  };
};

export const updateCourse = async (
  courseRequest: CourseRequest,
  courseCode: string
): Promise<ApiResponse<CourseDTO>> => {
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const requestId = `update-course-${crypto.randomUUID()}`;

  const response = await fetch(
    `${ENV.API_URL}/api/courses/${requestId}/${courseCode}`,
    {
      method: "PUT",
      headers: {
        "x-access-token": session.token.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseRequest),
      cache: "no-store",
    }
  );

  if (response.status !== 200) {
    return {
      status: response.status,
      message: response.statusText,
    };
  }

  const data = (await response.json()) as CourseDTO;

  return {
    status: response.status,
    message: response.statusText,
    data: data,
  };
};
