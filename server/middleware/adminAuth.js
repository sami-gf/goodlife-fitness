/**
 * Admin Authentication Middleware
 * Protects administrative read endpoints from unauthorized public access.
 */
export function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'goodlife_admin_dev_key';

  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Admin authorization key required.',
    });
  }
  next();
}
