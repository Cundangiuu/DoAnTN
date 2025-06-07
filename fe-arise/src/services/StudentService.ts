"use server";

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base/Pageable";
import { StudentDTO } from "@/dtos/student/StudentDTO";
import { StudentGradeDTO } from "@/dtos/student/StudentGradeDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const exportStudents = async (
  query?: string | null,
  hasAvatar?: string | null
): Promise<ApiResponse<StudentDTO[]>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/students/${requestId}/export?${query ? `query=${query}&` : ""
        }${hasAvatar ? `hasAvatar=${hasAvatar}` : ""}`,
        {
          method: "GET",
          headers: { "x-access-token": token },
          cache: "no-store",
        }
      );
      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data: StudentDTO[] = (await response.json()) as StudentDTO[];

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

export const getAllStudents = async (
  page?: number,
  size?: number,
  query?: string | null,
  hasAvatar?: string | null
): Promise<ApiResponse<Pageable<StudentDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/students/${requestId}?page=${page}&size=${size}&${query && `query=${query}`
        }&${hasAvatar && `hasAvatar=${hasAvatar}`}`,
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

      const data: Pageable<StudentDTO> =
        (await response.json()) as Pageable<StudentDTO>;

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

export const getAllStudentsWithoutDept = async (
  page?: number,
  size?: number,
  query?: string | null,
  hasAvatar?: string | null
): Promise<ApiResponse<Pageable<StudentDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL
        }/api/students/${requestId}/not-debt?page=${page}&size=${size}&${query && `query=${query}&${hasAvatar && `hasAvatar=${hasAvatar}`}`
        }`,
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

      const data: Pageable<StudentDTO> =
        (await response.json()) as Pageable<StudentDTO>;
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

export const getTotalStudent = async (): Promise<ApiResponse<number>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/students/${requestId}/total`,
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

export const getStudent = async (
  studentCode: string
): Promise<ApiResponse<StudentDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/students/${requestId}/${studentCode}`,
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

      const data: StudentDTO = (await response.json()) as StudentDTO;

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

export const getStudentById = async (
  studentId: number
): Promise<ApiResponse<StudentDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/students/${requestId}/${studentId}/id`,
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

      const data: StudentDTO = (await response.json()) as StudentDTO;

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

export const createStudent = async (
  studentFormData: FormData
): Promise<ApiResponse<StudentDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(`${ENV.API_URL}/api/students/${requestId}`, {
        method: "POST",
        headers: {
          "x-access-token": token,
        },
        body: studentFormData,
        cache: "no-store",
      });

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as StudentDTO;

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

export const updateStudent = async (
  studentFormData: FormData,
  id: number
): Promise<ApiResponse<StudentDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/students/${requestId}/${id}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
          },
          body: studentFormData,
          cache: "no-store",
        }
      );

      if (response.status != 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as StudentDTO;

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

export const deleteStudent = async (
  studentId: number
): Promise<ApiResponse<StudentDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/students/${requestId}/${studentId}`,
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

      const data: StudentDTO = (await response.json()) as StudentDTO;

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

export const getStudentsWithoutClassCode = async (): Promise<
  ApiResponse<StudentDTO[]>
> => {
  return withAuth(async (token) => {
    const requestId = crypto.randomUUID();
    const response = await fetch(
      `${ENV.API_URL}/api/students/${requestId}/pre-enrollment`,
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

    const data = (await response.json()) as StudentDTO[];

    return {
      status: response.status,
      message: response.statusText,
      data: data,
    };
  });
};

export const getStudentsByClassCode = async (
  classCode: string
): Promise<ApiResponse<StudentDTO[]>> => {
  return withAuth(async (token) => {
    const requestId = crypto.randomUUID();
    const response = await fetch(
      `${ENV.API_URL}/api/students/${requestId}/${classCode}/class-code`,
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

    const data = (await response.json()) as StudentDTO[];

    return {
      status: response.status,
      message: response.statusText,
      data: data,
    };
  });
};

export const getGradeOfStudentGroupedByClass = async (
  studentId: number
): Promise<ApiResponse<StudentGradeDTO[]>> => {
  return withAuth(async (token) => {
    const requestId = crypto.randomUUID();
    const response = await fetch(
      `${ENV.API_URL}/api/students/${requestId}/${studentId}/grade`,
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

    const data = (await response.json()) as StudentGradeDTO[];

    return {
      status: response.status,
      message: response.statusText,
      data: data,
    };
  });
};
