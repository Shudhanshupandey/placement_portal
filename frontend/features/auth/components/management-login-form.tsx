"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, ArrowRight, Loader2, ShieldCheck, Building2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES, homeForRole } from "@/constants/routes";
import { writeRouteHint } from "@/lib/auth/route-hint";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/credentials.schema";
import { adminAuthService } from "@/features/auth/services/admin-auth.service";
import { recruiterAuthService } from "@/features/auth/services/recruiter-auth.service";

/** Roles that authenticate through the management portal. */
type ManagementRole = "recruiter" | "admin";

const TABS: {
  role: ManagementRole;
  label: string;
  icon: typeof Building2;
  hint: string;
}[] = [
  {
    role: "recruiter",
    label: "Recruiter",
    icon: Building2,
    hint: "Post jobs, search candidates and manage your campus hiring.",
  },
  {
    role: "admin",
    label: "Admin",
    icon: ShieldCheck,
    hint: "Placement Cell administrators only. Access is role-validated.",
  },
];

/**
 * Unified Management Portal sign-in. A single email + password form gated by a
 * Recruiter | Admin selector. The chosen role decides which credentials are
 * accepted — the service revalidates the server-set role claim and signs the
 * user out on any mismatch, so recruiter creds can never unlock the admin role
 * (and vice-versa). Firestore rules enforce the same boundary on every read.
 */
export function ManagementLoginForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<ManagementRole>("recruiter");
  const [submitting, setSubmitting] = React.useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const active = TABS.find((t) => t.role === role)!;

  const switchRole = (next: ManagementRole) => {
    if (next === role) return;
    setRole(next);
    form.clearErrors();
  };

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      if (role === "admin") {
        await adminAuthService.login(values.email, values.password);
      } else {
        await recruiterAuthService.login(values.email, values.password);
      }
      writeRouteHint({
        role,
        profileCompleted: true,
        verificationStatus: role === "admin" ? "verified" : "unverified",
        approvalStatus: null,
      });
      toast.success(role === "admin" ? "Welcome, administrator" : "Signed in");
      // Recruiter home handles the email-verify + approval gates.
      router.replace(homeForRole(role));
    } catch (err) {
      toast.error("Sign-in failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Management Portal
        </div>
        <h1 className="text-2xl font-bold text-heading">Sign in to continue</h1>
        <p className="text-sm text-muted-foreground">{active.hint}</p>
      </div>

      {/* Role selector */}
      <div
        role="radiogroup"
        aria-label="Account type"
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-section p-1"
      >
        {TABS.map(({ role: r, label, icon: Icon }) => {
          const selected = r === role;
          return (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => switchRole(r)}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                selected ? "text-primary" : "text-muted-foreground hover:text-heading"
              )}
            >
              {selected && (
                <motion.span
                  layoutId="mgmt-role-pill"
                  className="absolute inset-0 rounded-lg bg-card shadow-soft ring-1 ring-border"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{role === "admin" ? "Admin Email" : "Work Email"}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder={role === "admin" ? "admin@saitm.ac.in" : "you@company.com"}
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel required>Password</FormLabel>
                  <Link
                    href={ROUTES.forgotPassword}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput {...field} autoComplete="current-password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Signing in…
              </>
            ) : (
              <>
                Sign in as {active.label} <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>

      {role === "recruiter" ? (
        <p className="text-center text-sm text-muted-foreground">
          New recruiter?{" "}
          <Link href={ROUTES.portalRegister} className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Admin accounts are provisioned by the Placement Cell — there is no public admin signup.
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Are you a student?{" "}
        <Link href={ROUTES.studentLogin} className="font-medium text-primary hover:underline">
          Go to the Student Portal
        </Link>
      </p>
    </div>
  );
}
