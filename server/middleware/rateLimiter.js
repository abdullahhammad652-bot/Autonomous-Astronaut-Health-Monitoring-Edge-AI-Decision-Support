// Sliding Window Rate Limiter Middleware
// Protects API against DDoS, abusive scraping, and brute force

const requestCounts = new Map();

/**
 * Creates rate limiter middleware
 * @param {number} maxRequests - Maximum requests allowed per window
 * @param {number} windowMs - Time window in milliseconds (e.g. 60000ms = 1 min)
 */
export function rateLimiter(maxRequests = 60, windowMs = 60000) {
  return (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!requestCounts.has(clientIp)) {
      requestCounts.set(clientIp, []);
    }

    // Filter requests to only those inside the active sliding window
    const timestamps = requestCounts.get(clientIp).filter(time => now - time < windowMs);
    
    // Set standard RateLimit HTTP headers
    const remaining = Math.max(0, maxRequests - timestamps.length);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    if (timestamps.length >= maxRequests) {
      const retryAfterSec = Math.ceil((timestamps[0] + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      
      return res.status(429).json({
        status: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000}s allowed.`,
        retryAfterSeconds: retryAfterSec
      });
    }

    timestamps.push(now);
    requestCounts.set(clientIp, timestamps);
    next();
  };
}
