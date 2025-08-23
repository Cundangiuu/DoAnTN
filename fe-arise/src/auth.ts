// src/auth.ts

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import google from "next-auth/providers/google";
import { ENV } from "./constants";
import { RoleDTO } from "./dtos/staff/RoleDTO";
import { addToken, getToken, verifyToken } from "./services/AuthService";

const TOKEN_DEFAULT = "kdjfa123KD@a";

async function refreshAccessToken(token: JWT) {
  try {
    const body = new URLSearchParams({
      client_id: ENV.GOOGLE_CLIENT_ID,
      client_secret: ENV.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken!,
    }).toString();

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const tokensOrError = await response.json();

    if (!response.ok) {
      token.error = "RefreshTokenError";
      return token;
    }

    const newTokens = tokensOrError as {
      id_token: string;
      expires_in: number;
      refresh_token?: string;
    };

    token.accessToken = newTokens.id_token;
    token.exp = Math.floor(Date.now() / 1000 + newTokens.expires_in);
    return token;
  } catch (error: unknown) { // ĐÃ SỬA: Thêm kiểu 'unknown' để an toàn hơn
    console.log("[refreshAccessToken] Error:", error);
    token.error = "RefreshTokenError";
    return token;
  }
}

const getRoleByUser = async (email: string | null | undefined): Promise<RoleDTO[] | undefined> => {
  if (!email) {
    console.log("[DEBUG] getRoleByUser: Bỏ qua vì email không tồn tại.");
    return;
  }

  const requestId = `${crypto.randomUUID()}`;
  const url = `${ENV.API_URL}/api/roles/${requestId}/user?email=${email}`;

  console.log(`[DEBUG] getRoleByUser: Đang thực hiện request tới URL: ${url}`);
  console.log(`[DEBUG] getRoleByUser: Giá trị của ENV.API_URL là: "${ENV.API_URL}"`);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { "x-access-token": TOKEN_DEFAULT },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[ERROR] Failed to get role by user: ${email}`);
      console.error(`[ERROR] Status Code: ${response.status}`);
      console.error(`[ERROR] Status Text: ${response.statusText}`);
      console.error(`[ERROR] Response Body: ${errorBody}`);
      return; // Trả về undefined
    }

    console.log(`[SUCCESS] getRoleByUser: Lấy role thành công cho user: ${email}`);
    return (await response.json()) as RoleDTO[];

  } catch (e: unknown) { // Giữ nguyên 'unknown'
    console.error(`[FATAL] Network error or unexpected exception in getRoleByUser for email: ${email}`);
    if (e instanceof Error) {
        console.error(`[FATAL] Error Name: ${e.name}`);
        console.error(`[FATAL] Error Message: ${e.message}`);
        // ĐÃ SỬA: Dùng toán tử 'in' để kiểm tra an toàn thay vì 'as any'
        if ('cause' in e && e.cause) {
            console.error(`[FATAL] Error Cause:`, e.cause);
        }
        console.error(`[FATAL] Stack Trace: ${e.stack}`);
    } else {
        console.error(`[FATAL] Caught a non-error value:`, e);
    }
    // Không trả về object lỗi nữa để session callback xử lý dễ hơn
    return;
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    google({
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth }) {
      return !auth?.error;
    },
    async signIn({ user, account, profile }) {
      if (!profile?.sub) {
        console.error("[ERROR] signIn failed - Missing profile.sub");
        return false;
      }
      if (!user.email) {
        console.error("[ERROR] signIn failed - Missing user.email");
        return false;
      }
      if (!account?.id_token) {
        console.error("[ERROR] signIn failed - Missing account.id_token");
        return false;
      }

      if (account.refresh_token) {
        const response = await addToken(account.id_token, {
          code: profile.sub,
          refreshToken: account.refresh_token,
          email: user.email,
          firstName: profile.given_name ?? null,
          lastName: profile.family_name ?? null,
          phoneNumber: profile.phone_number ?? null,
          avatarUrl: profile.picture ?? null,
        });

        if (!response.data) {
          console.error("[ERROR] addToken failed. Response:", response);
          return false;
        }

        return true;
      }

      return true;
    },
    async jwt({ token, account, user }) {
      if (account?.providerAccountId && account?.id_token) {
        const response = await getToken(account.providerAccountId);
        if (!response.data) {
          token.error = "TokenError";
          return token;
        }
        return {
          ...token,
          loginSince: new Date(response.data.updatedAt),
          accessToken: account.id_token,
          refreshToken: response.data.refreshToken,
          userId: response.data.id.toString(),
          user,
        };
      }

      if (ENV.AUTH_LIMIT + new Date(token.loginSince).getTime() < Date.now()) {
        token.error = "Session Expired. Please login again";
        return token;
      }

      const verifiedToken = await verifyToken(token.accessToken);

      if (verifiedToken.status === 200) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.error = token.error;
      session.token = token;

      const roles = await getRoleByUser(token.email);
      // ĐÃ SỬA: Kiểm tra roles là mảng trước khi gán để tránh lỗi runtime
      if (Array.isArray(roles)) {
        session.roles = roles;
      } else {
        session.roles = []; // Hoặc xử lý lỗi theo cách khác nếu cần
      }

      session.userId = token.userId as string;

      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    error?: JWT["error"];
    token: JWT;
    roles: RoleDTO[];
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    loginSince: Date;
    accessToken: string;
    expires_at: number;
    refreshToken?: string;
    userId?: string;
    error?:
      | "RefreshTokenError"
      | "TokenError"
      | "Session Expired. Please login again";
  }
}