"use server"

import { ENV } from "@/constants";
import { GradeDTO } from "@/dtos";
import { Pageable } from "@/dtos/base";
import { GradeRequestDTO } from "@/dtos/grade/GradeRequestDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

type GetGradesParams = {
  page?: number;
  size?: number;
  testType?: string;
  classId?: number;
};

export const getAllGradesByClassId = async ({
  page = 0,
  size = 1000,
  testType,
  classId,
}: GetGradesParams): Promise<ApiResponse<Pageable<GradeDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/grades/${requestId}/classes/${classId}?page=${page}&size=${size}&testType=${testType}`,
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

      const data: Pageable<GradeDTO> = (await response.json()) as Pageable<GradeDTO>;

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

export const getAllGradesByStudentId = async (studentId: number, page?: number, size?: number, testType?: string, classId?: number): Promise<ApiResponse<Pageable<GradeDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const url = new URL(`${ENV.API_URL}/api/grades/${requestId}/students/${studentId}`);
      if (page) url.searchParams.append("page", page.toString());
      if (size) url.searchParams.append("size", size.toString());
      if (testType) url.searchParams.append("testType", testType);
      if (classId) url.searchParams.append("classId", classId.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
      });

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: Pageable<GradeDTO> = (await response.json()) as Pageable<GradeDTO>;

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

export const createGrade = async (bodyData: GradeRequestDTO): Promise<ApiResponse<GradeDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {

      const response = await fetch(
        `${ENV.API_URL}/api/grades/${requestId}`,
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

      const data = (await response.json()) as GradeDTO;

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

export const updateGrade = async (
  bodyData: GradeRequestDTO, dataId: number
): Promise<ApiResponse<GradeDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {

      const response = await fetch(
        `${ENV.API_URL}/api/grades/${requestId}/${dataId}`,
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

      const data = (await response.json()) as GradeDTO;

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

export const deleteGrade = async (id: number): Promise<ApiResponse<GradeDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/grades/${requestId}/${id}`,
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

export const generateDefaultGrades = async (classCode: string, testType: string): Promise<ApiResponse<GradeDTO[]>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      // Call the API endpoint directly
      const generateResponse = await fetch(
        `${ENV.API_URL}/api/grades/${requestId}/${classCode}/generate-grade?testType=${testType}`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
          },
          cache: "no-store",
        }
      );

      console.log(generateResponse.status !== 200);
      if (generateResponse.status !== 200) {
        return {
          status: generateResponse.status,
          message: generateResponse.statusText,
        };
      }

      const data = await generateResponse.json() as GradeDTO[];
      console.log(data);
      return {
        status: generateResponse.status,
        message: "Grades generated successfully",
        data: data,
      };
    } catch (e) {
      console.log(e);
      return { message: "Failed to generate grades", status: 500 };
    }
  });
}
