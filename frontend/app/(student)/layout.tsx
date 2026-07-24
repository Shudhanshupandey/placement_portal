"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { RequireAuth } from "@/components/shared/require-auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { RightPanel } from "@/components/layout/right-panel";

const COLLAPSE_KEY = "saitm.sidebar.collapsed";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  }, []);

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    router.replace(ROUTES.studentLogin);
  }, [signOut, router]);

  const width = collapsed ? 76 : 264;
  const showRightPanel = pathname !== ROUTES.student.dashboard;

  return (
    <RequireAuth role="student" requireComplete>
      <div
        className="min-h-screen bg-background"
        style={{ "--sb": `${width}px` } as React.CSSProperties}
      >
        {/* Desktop sidebar */}
        <motion.aside
          className="fixed inset-y-0 left-0 z-40 hidden lg:block"
          animate={{ width }}
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        >
          <AppSidebar
            collapsed={collapsed}
            onToggle={toggleCollapsed}
            onSignOut={handleSignOut}
          />
        </motion.aside>

        {/* Main column */}
        <div className="flex min-h-screen flex-col transition-[padding] duration-300 lg:pl-[var(--sb)]">
          <AppTopbar onOpenMobile={() => setMobileOpen(true)} onSignOut={handleSignOut} />
          <div className="flex flex-1">
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
            {showRightPanel && <RightPanel />}
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-heading/40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
              >
                <AppSidebar
                  variant="mobile"
                  collapsed={false}
                  onNavigate={() => setMobileOpen(false)}
                  onSignOut={handleSignOut}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </RequireAuth>
  );
}
