import { RequireAuth } from "@/components/admin/RequireAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/context/ToastContext";

/**
 * S'applique à toutes les pages du dashboard (`/admin`, `/admin/reservations`,
 * `/admin/menu`, `/admin/galerie`, `/admin/horaires`) mais pas à
 * `/admin/login`, qui vit en dehors de ce groupe de routes.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </RequireAuth>
  );
}
