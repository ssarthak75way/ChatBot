import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, (process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET) as string, {
    expiresIn: "30m"
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string, {
    expiresIn: "7d"
  });
}

export function verifyToken(token: string, secretType: "access" | "refresh" = "access"): JwtPayload {
  const secret = secretType === "access"
    ? (process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET)
    : (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  return jwt.verify(token, secret as string) as JwtPayload;
}
