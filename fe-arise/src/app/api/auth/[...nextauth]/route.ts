import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// Thêm dòng này để buộc Vercel sử dụng môi trường Node.js cho route này
export const runtime = "nodejs"