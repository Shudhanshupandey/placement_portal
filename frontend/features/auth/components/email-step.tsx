"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { emailSchema, type EmailFormValues } from "@/features/auth/schemas/auth.schema";
import { ALLOWED_DOMAIN, ALLOWED_DOMAINS_LABEL } from "@/lib/auth/email-domain";

interface EmailStepProps {
  defaultEmail?: string;
  submitting: boolean;
  onSubmit: (email: string) => void;
}

export function EmailStep({ defaultEmail = "", submitting, onSubmit }: EmailStepProps) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: defaultEmail },
    mode: "onSubmit",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-heading">Student Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Use your official SAITM college email to receive a one-time code.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => onSubmit(v.email))}
          className="space-y-5"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>College Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder={`yourname@${ALLOWED_DOMAIN}`}
                      className="pl-10"
                      disabled={submitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Sending code…
              </>
            ) : (
              <>
                Send verification code <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="flex items-start gap-2 rounded-xl bg-section p-3.5 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          Only{" "}
          <span className="font-medium text-heading">{ALLOWED_DOMAINS_LABEL}</span>{" "}
          addresses are permitted. We&apos;ll email you a 6-digit code to verify
          it&apos;s you.
        </p>
      </div>
    </div>
  );
}
