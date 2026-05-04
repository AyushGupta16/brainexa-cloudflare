-- Grant table access to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.withdrawals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doubts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- Ensure has_role function is accessible
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Fix user_roles RLS — current policy may block has_role() internal lookup
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Re-enable with a safe policy that doesn't block internal function calls
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "admin manage roles" ON public.user_roles;

-- Allow authenticated users to read user_roles (needed for has_role() to work)
CREATE POLICY "authenticated_read_user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (true);

-- Only admin can manage roles
CREATE POLICY "admin_manage_user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));
