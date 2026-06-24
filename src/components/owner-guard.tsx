import { useAuth } from '@/hooks/use-auth';
import { Navigate } from '@/lib/localized-router';
import { isAdmin } from '@/stores/access';
import { AuthGuard } from './auth-guard';

// Owner-only gate — the freelance invoicing tool is private. AuthGuard ensures a session; this then
// requires the session email to be an owner/admin email (stores/access ADMIN_EMAILS). Anyone else
// is sent home. Data is also RLS-restricted to the same emails, so this is defence-in-depth.
export function OwnerGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OwnerOnly>{children}</OwnerOnly>
    </AuthGuard>
  );
}

function OwnerOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user && !isAdmin(user.email)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
