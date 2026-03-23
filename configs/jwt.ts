import { logger } from "@/lib/logger";
import jwt from "jsonwebtoken";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const jwtConfig: { secret: Secret; expiresIn: SignOptions["expiresIn"] } = {
  secret: process.env.JWT_SECRET || "default_secret_key",
  expiresIn: "30d", // Token expiration time
};

const resetTokenConfig: { expiresIn: SignOptions["expiresIn"] } = {
  expiresIn: "15m",
};

// Generate JWT Token
const gJT = (payload: Record<string, unknown>): string => {
  const token = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  return token;
};

// Generate Password Reset Token
const gPRT = (email: string): string => {
  const token = jwt.sign({ email, purpose: "password_reset" }, jwtConfig.secret, {
    expiresIn: resetTokenConfig.expiresIn,
  });
  return token;
};

//verify JWT Token
const vJT = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    if (typeof decoded === "string") {
      return null;
    }
    return decoded;
  } catch (error) {
    logger.error("JWT verification failed:", error);
    return null;
  }
};

export const jwtUtils = {
  gJT,
  gPRT,
  vJT,
};
