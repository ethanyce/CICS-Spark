-- Create admin_permissions table to store granular permissions
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  granted BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_permission ON admin_permissions(permission);

-- Enable RLS
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Only super_admin can manage permissions
CREATE POLICY "Super admins can manage all permissions"
  ON admin_permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Admins can view their own permissions
CREATE POLICY "Admins can view their own permissions"
  ON admin_permissions
  FOR SELECT
  USING (user_id = auth.uid());

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, permission_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_permissions
    WHERE admin_permissions.user_id = $1
    AND admin_permissions.permission = $2
    AND admin_permissions.granted = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to grant default permissions to new admins
CREATE OR REPLACE FUNCTION grant_default_admin_permissions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    INSERT INTO admin_permissions (user_id, permission, granted)
    VALUES
      (NEW.id, 'submissions.view', true),
      (NEW.id, 'submissions.review', true),
      (NEW.id, 'users.view', true),
      (NEW.id, 'users.create', true),
      (NEW.id, 'reports.view', true),
      (NEW.id, 'fulltext.manage', true)
    ON CONFLICT (user_id, permission) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to grant default permissions when admin is created
-- Note: If trigger already exists, you may see a "trigger already exists" error
-- This is safe to ignore, or you can manually drop it first
CREATE TRIGGER trigger_grant_default_permissions
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION grant_default_admin_permissions();

-- Insert default permissions for existing admins
INSERT INTO admin_permissions (user_id, permission, granted)
SELECT 
  u.id,
  p.permission,
  true
FROM users u
CROSS JOIN (
  VALUES
    ('submissions.view'),
    ('submissions.review'),
    ('users.view'),
    ('users.create'),
    ('reports.view'),
    ('fulltext.manage')
) AS p(permission)
WHERE u.role = 'admin'
ON CONFLICT (user_id, permission) DO NOTHING;
