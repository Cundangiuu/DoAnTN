import { getReport } from "@/services/ClassDayService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { message: "Date range is required" },
      { status: 400 }
    );
  }

  const response = await getReport(new Date(from), new Date(to));

  if (!response.data) {
    return NextResponse.json(
      { message: "Failed to fetch" },
      { status: response.status }
    );
  }

  return new NextResponse(response.data, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": response.message,
    },
  });
}
