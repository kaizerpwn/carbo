import { NextResponse } from "next/server";
import type { NextRequest as NextRequestBase } from "next/server";

interface NextRequest extends NextRequestBase {
  user?: any;
}
import * as jose from "jose";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET || "test"),
};

interface RouteProtectionConfig {
  requiresAuth: boolean;
  redirectIfAuthenticated?: boolean;
}

interface RouteProtectionConfigMap {
  [route: string]: RouteProtectionConfig;
}

const routeProtectionConfig: RouteProtectionConfigMap = {
  "/": { requiresAuth: true },
  "/devices": { requiresAuth: true },
  "/profile": { requiresAuth: true },
  "/scan": { requiresAuth: true },
  "/sponsor": { requiresAuth: true },
  "/leaderboard": { requiresAuth: true },

  // >> Backend endpoints
  "/api/vision": { requiresAuth: true },
  "/api/devices": { requiresAuth: true },
};

async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, jwtConfig.secret);
    const isExpired = payload.exp ? Date.now() >= payload.exp * 1000 : false;
    if (isExpired) {
      return null;
    }
    return payload;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

function handleRedirection(
  payload: jose.JWTPayload | null,
  pathname: string,
  requestUrl: string
) {
  const config = routeProtectionConfig[pathname];

  if (!config) return null;

  if (config.redirectIfAuthenticated && payload) {
    return NextResponse.redirect(new URL("/", requestUrl));
  }

  if (config.requiresAuth && !payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", requestUrl));
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("accessToken")?.value;

  const payload = authToken ? await verifyToken(authToken) : null;

  const redirectResponse = handleRedirection(payload, pathname, request.url);

  return redirectResponse || NextResponse.next();
}

export const authMiddleware = async (
  req: NextRequest,
  next: () => Promise<NextResponse>
) => {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      token,
      (process.env.JWT_SECRET as string) || "test"
    );
    req.user = decoded;
    return next();
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
};

export const validateDeviceOwnership = async (
  req: NextRequest,
  deviceId: string
) => {
  const device = await prisma.device.findUnique({
    where: { id: String(deviceId) },
  });
  if (!device || device.userId !== req.user.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
};

export const config = {
  matcher: [
    "/",
    "/devices",
    "/profile",
    "/scan",
    "/sponsor",
    "/leaderboard",
    "/api/:path*",
  ],
};
