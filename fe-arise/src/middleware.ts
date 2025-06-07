import { auth } from "@/auth";
import { ApiResponse } from "./types";

export default auth((req) => {
  const PUBLIC_ROUTE = ["/login"];
  const DEFAULT_REDIRECT = "/";
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth && !req.auth.error;
  const isPublicRoute = PUBLIC_ROUTE.includes(nextUrl.pathname);

  if (!isPublicRoute && !isAuthenticated) {
    const searchParams = new URLSearchParams({
      redirect: `${nextUrl.pathname}?${nextUrl.searchParams.toString()}`,
    });
    return Response.redirect(
      new URL(`/login?${searchParams.toString()}`, req.url)
    );
  }

  if (isPublicRoute && isAuthenticated) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, req.url));
  }

  if (isAuthenticated) {
    const adminRoutes = ["/settings"];
    const accountantRoutes = ["/accounting"];
    const cudRoutes = ["/new", "/edit"];
    const roles = req.auth?.roles;
    const isTeacher = roles?.length == 1 && roles[0].name == "TEACHER";
    const hasRole = (requiredRoles: string[]) => {
      return roles?.some((role) => requiredRoles.includes(role.name));
    }

    if (
      adminRoutes.some((route) => nextUrl.pathname.startsWith(route)) &&
      !hasRole(["ADMIN"])
    ) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }

    if (
      accountantRoutes.some((route) => nextUrl.pathname.startsWith(route)) &&
      !hasRole(["ADMIN", "ACCOUNTANT"])
    ) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }

    if (
      cudRoutes.some((route) => nextUrl.pathname.endsWith(route)) &&
      isTeacher
    ) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next).*)",
    "/settings/:path*",
    "/accounting/:path*",
  ],
};

export const withAuth = async <T>(
  apiCall: (token: string) => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  const session = await auth();
  if (!session?.token || !session.user?.email) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  return apiCall(session.token.accessToken);
};
