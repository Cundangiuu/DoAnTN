"use server";
import { ENV } from "@/constants";
import { StaffDTO } from "@/dtos";
import { AddTokenDTO } from "@/dtos/token/request";
import { ApiResponse } from "@/types";

export const getToken = async (
  userId: string
): Promise<ApiResponse<StaffDTO>> => {
  const requestId = `${crypto.randomUUID()}`;
  const response = await fetch(
    `${ENV.API_URL}/api/public/user/refresh-token/${requestId}?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "x-access-token": ENV.DEFAULT_TOKEN,
        "content-type": "application/json",
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

  const blog = (await response.json()) as StaffDTO;

  return {
    status: response.status,
    message: response.statusText,
    data: blog,
  };
};

export const addToken = async (
  accessToken: string,
  addTokenDTO: AddTokenDTO
): Promise<ApiResponse<StaffDTO>> => {
  const requestId = `add-token-${crypto.randomUUID()}`;
  const response = await fetch(
    `${ENV.API_URL}/api/auth/refresh-token/${requestId}`,
    {
      method: "POST",
      headers: {
        "x-access-token": accessToken,
        "content-type": "application/json",
      },
      body: JSON.stringify(addTokenDTO),
      cache: "no-store",
    }
  );
  if (response.status !== 200) {
    return {
      status: response.status,
      message: response.statusText,
    };
  }

  const blog = (await response.json()) as StaffDTO;

  return {
    status: response.status,
    message: response.statusText,
    data: blog,
  };
};

export async function verifyToken(
  accessToken: string
): Promise<ApiResponse<void>> {
  const requestId = `${crypto.randomUUID()}`;
  try {
    const response = await fetch(
      `${ENV.API_URL}/api/public/user/verify/${requestId}`,
      {
        method: "POST",
        headers: {
          "x-access-token": ENV.DEFAULT_TOKEN,
          "content-type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        status: response.status,
        message: "Failed",
      };
    }

    return {
      status: 200,
      message: "ok",
    };
  } catch (e) {
    console.log(e);

    return { message: "Failed to fetch", status: 500 };
  }
}
