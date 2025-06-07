"use server";
import { ENV } from "@/constants";
import { LessonDTO } from "@/dtos/lesson/LessonDTO";
import { LessonRequest } from "@/dtos/requests/LessonRequest";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllLessonByCourse = async (
  courseId: string
): Promise<ApiResponse<LessonDTO[]>> => {
  return withAuth(async (token) => {
    const requestId = crypto.randomUUID();
    const response = await fetch(
      `${ENV.API_URL}/api/lesson/${requestId}/${courseId}`,
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

    const blog = (await response.json()) as LessonDTO[];

    return {
      status: response.status,
      message: response.statusText,
      data: blog,
    };
  });
};

export const createLesson = async (
  lessonRequest: LessonRequest[]
): Promise<ApiResponse<LessonDTO[]>> => {
  return withAuth(async (token) => {
    const requestId = `add-lesson-${crypto.randomUUID()}`;
    const response = await fetch(`${ENV.API_URL}/api/lesson/${requestId}`, {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lessonRequest),
      cache: "no-store",
    });

    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.statusText,
      };
    }

    const data = (await response.json()) as LessonDTO[];

    return {
      status: response.status,
      message: response.statusText,
      data: data,
    };
  });
};

export const updateLesson = async (
  lessonRequest: LessonRequest,
  lessonId: number
): Promise<ApiResponse<LessonDTO>> => {
  return withAuth(async (token) => {
    const requestId = `update-lesson-${crypto.randomUUID()}`;
    const response = await fetch(
      `${ENV.API_URL}/api/lesson/${requestId}/${lessonId}`,
      {
        method: "PUT",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonRequest),
        cache: "no-store",
      }
    );

    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.statusText,
      };
    }

    const data = (await response.json()) as LessonDTO;

    return {
      status: response.status,
      message: response.statusText,
      data: data,
    };
  });
};

export const deleteLesson = async (
  lessonId: number
): Promise<ApiResponse<LessonDTO>> => {
  return withAuth(async (token) => {
    const requestId = `update-lesson-${crypto.randomUUID()}`;
    const response = await fetch(
      `${ENV.API_URL}/api/lesson/${requestId}/${lessonId}`,
      {
        method: "DELETE",
        headers: {
          "x-access-token": token,
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

    const data = (await response.json()) as LessonDTO;

    return {
      status: response.status,
      message: response.statusText,
      data: data,
    };
  });
};
