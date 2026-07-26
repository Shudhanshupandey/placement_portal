"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  PortalSidebar,
  type SidebarNavItem,
  type SidebarNavGroup,
} from "@/components/layout/portal-sidebar";

/**
 * The application frame shared by all three portals: a collapsible desktop
 * sidebar, an accessible mobile drawer, a sticky topbar supplied by the caller,
 * and the main content column.
 *
 * Previously the student layout and the console shell each carried their own
 * copy of this; they behaved subtly differently and only one of them ever got
 * a given fix. One implementation now serves all three.
 */

const COLLAPSE_KEY = "saitm.sidebar.collapsed";

const SIDEBAR_WIDTH = { expanded: 264, collapsed: 76 } as const;

interface TopbarRenderProps {
  /** Wire to the mobile menu button. */
  onOpenMobile: () => void;
  /** Whether the mobile drawer is currently open (for `aria-expanded`). */
  mobileOpen: boolean;
}

interface PortalShellProps {
  nav: SidebarNavItem[];
  groups: SidebarNavGroup[];
  portalLabel: string;
  onSignOut: () => void;
  topbar: (props: TopbarRenderProps) => React.ReactNode;
  /** Optional secondary column, shown only on very wide viewports. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}

export function PortalShell({
  nav,
  groups,
  portalLabel,
  onSignOut,
  topbar,
  aside,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // `localStorage` is unreachable during SSR, so the first paint is always the
  // expanded rail. `hydrated` lets us apply the restored width instantly on
  // that first client commit instead of animating 264 → 76 in the user's face
  // on every single page load.
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    setHydrated(true);
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  }, []);

  // Close the drawer on any navigation, including browser back/forward — which
  // an `onClick` handler on the links alone would miss.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close it when the viewport grows past `lg` (rotating a tablet, resizing a
  // window). The permanent sidebar takes over there, and leaving the dialog
  // mounted would strand a dismiss-less overlay over a scroll-locked page.
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      if (mq.matches) setMobileOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const width = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;

  return (
    <div
      className="min-h-safe-screen bg-background"
      style={{ "--sb": `${width}px` } as React.CSSProperties}
    >
      {/* Lets keyboard users jump the nav on every page. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-card"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-40 hidden lg:block"
        animate={{ width }}
        initial={false}
        transition={hydrated ? { type: "spring", stiffness: 400, damping: 40 } : { duration: 0 }}
      >
        <PortalSidebar
          nav={nav}
          groups={groups}
          portalLabel={portalLabel}
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          onSignOut={onSignOut}
        />
      </motion.aside>

      {/* Main column */}
      <div className="flex min-h-safe-screen flex-col transition-[padding] duration-300 ease-premium lg:pl-[var(--sb)]">
        {topbar({ onOpenMobile: () => setMobileOpen(true), mobileOpen })}

        <div className="flex flex-1">
          <main
            id="main-content"
            tabIndex={-1}
            className="page-gutter min-w-0 flex-1 py-5 focus:outline-none sm:py-6 lg:py-8"
          >
            {/* Roomy on laptops, and allowed to breathe on 27"+ displays
                instead of stranding content in a narrow column. */}
            <div className="mx-auto max-w-6xl 3xl:max-w-content">{children}</div>
          </main>
          {aside}
        </div>
      </div>

      {/* Mobile drawer — Radix Dialog gives focus trap, Escape, scroll lock and
          focus restoration, none of which a bare animated <div> provides. */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          title={`${portalLabel} menu`}
          description="Primary navigation"
          showClose={false}
          className="w-[min(20rem,85vw)] border-0 p-0"
        >
          <PortalSidebar
            nav={nav}
            groups={groups}
            portalLabel={portalLabel}
            variant="mobile"
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
            onSignOut={onSignOut}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
