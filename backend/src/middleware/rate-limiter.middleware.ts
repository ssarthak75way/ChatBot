import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per `window` for auth
    message: { message: "Too many attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

export const chatRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Limit each IP to 50 chat messages per hour
    message: { message: "Chat limit reached for this hour. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
