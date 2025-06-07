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
  } catch (error) {
    console.log(error);
    token.error = "RefreshTokenError";
    return token;
  }
}

const getRoleByUser = async (email: string | null | undefined) => {
  const requestId = `${crypto.randomUUID()}`;
  try {
    const response = await fetch(
      `${ENV.API_URL}/api/roles/${requestId}/user?email=${email}`,
      {
        method: "GET",
        cache: "no-store",
        headers: { "x-access-token": TOKEN_DEFAULT },
      }
    );

    if (response.status !== 200) {
      console.log("Failed to get role by user", email);
      return;
    }

    return (await response.json()) as RoleDTO[];
  } catch (e) {
    console.log(e);
    return { message: "Failed to fetch", status: 500 };
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
      session.roles = roles as RoleDTO[];
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
