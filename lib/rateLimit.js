const tracker = new Map();

/**
 * Basic in-memory rate limiter for serverless environment / local dev.
 * Limits IP addresses to a max of 5 requests per 15 minutes.
 */
export function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 5;

  if (!tracker.has(ip)) {
    tracker.set(ip, [now]);
    return { success: true, remaining: max - 1 };
  }

  let timestamps = tracker.get(ip);
  // Filter timestamps to only keep those within the 15-minute window
  timestamps = timestamps.filter(time => now - time < windowMs);

  if (timestamps.length >= max) {
    return { success: false, remaining: 0 };
  }

  timestamps.push(now);
  tracker.set(ip, timestamps);
  return { success: true, remaining: max - timestamps.length };
}
