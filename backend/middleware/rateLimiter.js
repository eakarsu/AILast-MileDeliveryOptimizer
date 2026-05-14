const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for AI endpoints.
 * Allows 20 requests per hour per user or IP.
 */
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded. Max 20 requests/hour.' },
  keyGenerator: (req) => req.user ? `user:${req.user.id || req.user.userId}` : req.ip,
});

/**
 * General API rate limiter.
 * Allows 200 requests per 15 minutes per IP.
 */
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
  },
});

module.exports = { aiRateLimiter, generalRateLimiter };
