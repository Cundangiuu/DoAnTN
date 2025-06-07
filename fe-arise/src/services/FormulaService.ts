"use server";

import { ENV } from "@/constants";
import { Pageable } from "@/dtos/base";
import { FormulaDTO } from "@/dtos/formula/FormulaDTO";
import { FormulaRequestDTO } from "@/dtos/formula/FormulaRequestDTO";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getAllFormulas = async (page?: number,
  size?: number): Promise<ApiResponse<Pageable<FormulaDTO>>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/formulas/${requestId}?page=${page}&size=${size}`, {
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


      const data = (await response.json()) as Pageable<FormulaDTO>;

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

export const createFormula = async (
  formulaRequest: FormulaRequestDTO
): Promise<ApiResponse<FormulaDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(`${ENV.API_URL}/api/settings/formulas/${requestId}`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulaRequest),
        cache: "no-store",
      })

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as FormulaDTO;

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

export const updateFormula = async (
  formulaData: FormulaRequestDTO,
  formulaId: number
): Promise<ApiResponse<FormulaDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/formulas/${requestId}/${formulaId}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formulaData),
          cache: "no-store",
        }
      );

      if (response.status !== 200) {
        return {
          status: response.status,
          message: response.statusText,
        };
      }

      const data = (await response.json()) as FormulaDTO;

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

export const deleteFormula = async (
  id: number
): Promise<ApiResponse<FormulaDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;

    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/formulas/${requestId}/${id}`,
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

      const data: FormulaDTO = (await response.json()) as FormulaDTO;

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

export const getFormula = async (
  id: number
): Promise<ApiResponse<FormulaDTO>> => {
  return withAuth(async (token) => {
    const requestId = `${crypto.randomUUID()}`;
    try {
      const response = await fetch(
        `${ENV.API_URL}/api/settings/formulas/${requestId}/${id}`,
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

      const data: FormulaDTO = (await response.json()) as FormulaDTO;

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
