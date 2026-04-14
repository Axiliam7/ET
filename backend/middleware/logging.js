/**
 * Request logging middleware.
 * Logs method, path, and ISO timestamp for every incoming request.
 */
export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
}
