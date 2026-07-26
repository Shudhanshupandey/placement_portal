"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
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
import { ROUTES } from "@/constants/routes";
import { writeRouteHint } from "@/lib/auth/route-hint";
import {
  recruiterRegisterSchema,
  type RecruiterRegisterValues,
} from "@/features/auth/schemas/credentials.schema";
import { recruiterAuthService } from "@/features/auth/services";

export function RecruiterRegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const form = useForm<RecruiterRegisterValues>({
    resolver: zodResolver(recruiterRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      designation: "",
      phone: "",
      companyWebsite: "",
      password: "",
      confirmPassword: "",
      agree: false as unknown as true,
    },
  });

  const onSubmit = async (values: RecruiterRegisterValues) => {
    setSubmitting(true);
    try {
      await recruiterAuthService.register(values);
      // Sign in immediately so they land on the recruiter area (verify + pending).
      await recruiterAuthService.login(values.email, values.password);
      writeRouteHint({
        role: "recruiter",
        profileCompleted: true,
        verificationStatus: "unverified",
        approvalStatus: null,
      });
      toast.success("Account created", {
        description: "Verify your email — access is enabled after admin approval.",
      });
      router.replace(ROUTES.recruiter.home);
    } catch (err) {
      toast.error("Registration failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-heading">Recruiter Registration</h1>
        <p className="text-sm text-muted-foreground">
          Create an account to recruit at SAITM. The Placement Cell will review and approve it.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="HR Manager" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Work Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="you@company.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Optional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Company</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Company Pvt. Ltd." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="company.com" />
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
                  <FormLabel required>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete="new-password" placeholder="Min 8 characters" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete="new-password" placeholder="Re-enter password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem>
                {/* Generous vertical padding gives the checkbox a 44px-tall
                    tap row without inflating the box itself; `accent-primary`
                    tints the native control from the palette token. */}
                <label className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2"
                  />
                  <span>
                    I confirm the information is accurate and accept the SAITM recruiter terms.
                  </span>
                </label>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Creating account…
              </>
            ) : (
              <>
                Create account <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href={ROUTES.portal} className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
