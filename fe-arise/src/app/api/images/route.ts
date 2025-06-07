"use server"

import { ImageService } from "@/services";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get("filePath");

    if (filePath) {
        if (filePath.startsWith("http")) {
            const response = await ImageService.getExternalImage(filePath);
            if (response.status === 200 && response.data) {
                const contentType = filePath.split(".").pop();
                return new Response(response.data, {
                    headers: {
                        "Content-Type": `image/${contentType}`,
                    },
                });
            } else {
                return NextResponse.json({
                    message: "Failed to fetch image",
                    error: response.message || "Unknown error",
                }, { status: response.status });
            }
        }

        const response = await ImageService.getImage(filePath);
        const contentType = filePath.split(".").pop();

        if (response.status === 200 && response.data) {
            return new Response(response.data, {
                headers: {
                    "Content-Type": `image/${contentType}`,
                },
            });
        } else {
            return NextResponse.json({
                message: "Failed to fetch image",
                error: response.message || "Unknown error",
            }, { status: response.status });
        }
    }

    return NextResponse.json({
        message: "fileName parameter is required.",
    }, { status: 400 });
}
