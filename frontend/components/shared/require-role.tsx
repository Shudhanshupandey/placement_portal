"use client";

import * as React from "react";
import { RequireAuth } from "@/components/shared/require-auth";
import type { Role } from "@/constants/roles";

/** Thin wrapper: enforce a role (and optional recruiter approval). */
export function RequireRole({
  role,
  requireApproved,
  children,
}: {
  role: Role;
  requireApproved?: boolean;
  children: React.ReactNode;
}) {
  return (
    <RequireAuth role={role} requireApproved={requireApproved}>
      {children}
    </RequireAuth>
  );
}
