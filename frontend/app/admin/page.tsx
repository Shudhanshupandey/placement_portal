"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export default function AdminHomePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut();
    router.replace(ROUTES.portal);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-section px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground">
          <ShieldCheck className="h-8 w-8" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-heading">Admin authenticated</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {user?.email} with administrator privileges. The management console
          (students, recruiters, drives, analytics) arrives in a later phase.
        </p>
        <Button variant="ghost" className="mt-6" onClick={onSignOut}>
          <LogOut /> Sign out
        </Button>
      </div>
    </div>
  );
}
