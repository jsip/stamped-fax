import rateLimit from 'express-rate-limit';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hr in milliseconds
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'You have exceeded the request limit. Try again in a day! :)',
  legacyHeaders: true,
});