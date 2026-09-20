/**
 * Admin Authentication Middleware
 * Protects administrative read endpoints from unauthorized public access.
 */
export function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const validKeys = [
    process.env.ADMIN_SECRET_KEY,
    'goodlife_super_secret_admin_key_2026',
    'goodlife_admin_dev_key',
  ].filter(Boolean);

  if (!adminKey || !validKeys.includes(adminKey)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Admin authorization key required.',
    });
  }
  next();
}
