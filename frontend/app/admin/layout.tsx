import { RequireRole } from "@/components/shared/require-role";

/** Every /admin route requires the admin role (login lives at /portal). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole role="admin">{children}</RequireRole>;
}
