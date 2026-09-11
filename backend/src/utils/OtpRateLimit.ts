import rateLimit from 'express-rate-limit';

export const otpRequestLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes window
  max: 3, // Limit each IP or identifier to 3 requests per window
  message: {
    status: 429,
    message: "Too many OTP requests. Please try again after 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Advanced production tip: Limit by Email instead of just IP
  keyGenerator: (req) => req.body.email || req.ip, 
});