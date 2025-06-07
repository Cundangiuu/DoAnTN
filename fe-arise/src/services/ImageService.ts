"use server";

import { ENV } from "@/constants";
import { withAuth } from "@/middleware";
import { ApiResponse } from "@/types";

export const getImage = async (
    filePath: string
): Promise<ApiResponse<Blob>> => {
    return withAuth(async (token) => {
        const requestId = `${crypto.randomUUID()}`;
        try {
            const response = await fetch(
                `${ENV.API_URL}/api/assets/${requestId}?filePath=${filePath}`,
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
                message: response.statusText,
                data: data,
            };
        } catch (e) {
            console.log(e)
            return { message: "Failed to fetch", status: 500 };
        }
    });
};

export const getExternalImage = async (
    fileUrl: string
): Promise<ApiResponse<Blob>> => {
    try {
        const response = await fetch(fileUrl, { method: "GET" });

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
            message: response.statusText,
            data: data,
        }
    } catch (e) {
        console.log(e)
        return { message: "Failed to fetch", status: 500 };
    }
};