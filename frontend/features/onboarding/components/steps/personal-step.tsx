"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoUpload } from "@/features/onboarding/components/photo-upload";
import { WizardNav } from "@/features/onboarding/components/wizard-nav";
import {
  personalSchema,
  type PersonalFormValues,
} from "@/features/onboarding/schemas/personal.schema";
import {
  CATEGORY_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  INDIAN_STATES,
} from "@/features/onboarding/constants";

interface PersonalStepProps {
  defaultValues: Partial<PersonalFormValues>;
  email: string;
  submitting: boolean;
  step: number;
  onSubmit: (values: PersonalFormValues) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function PersonalStep({
  defaultValues,
  email,
  submitting,
  step,
  onSubmit,
  onBack,
  onSkip,
}: PersonalStepProps) {
  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: "",
      gender: undefined,
      dateOfBirth: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      aadhaarNumber: "",
      category: undefined,
      bloodGroup: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      photoUrl: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="photoUrl"
            render={({ field }) => (
              <PhotoUpload value={field.value} onChange={field.onChange} />
            )}
          />

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Aarav Sharma" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <Label className="flex items-center gap-1.5">
                College Email <Lock className="h-3 w-3 text-muted-foreground" />
              </Label>
              <Input value={email} readOnly disabled className="bg-section" />
            </FormItem>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-4 pt-1"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <label
                          key={g.value}
                          className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                        >
                          <RadioGroupItem value={g.value} /> {g.label}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Date of Birth</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" max={new Date().toISOString().split("T")[0]} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Mobile Number</FormLabel>
                  <FormControl>
                    <Input {...field} inputMode="numeric" maxLength={10} placeholder="10-digit number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternateMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Mobile</FormLabel>
                  <FormControl>
                    <Input {...field} inputMode="numeric" maxLength={10} placeholder="Optional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <FormControl>
                    <Input {...field} inputMode="numeric" maxLength={12} placeholder="Optional · 12 digits" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOOD_GROUP_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel required>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder="House no., street, area" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Gurugram" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>State</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDIAN_STATES.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Pincode</FormLabel>
                  <FormControl>
                    <Input {...field} inputMode="numeric" maxLength={6} placeholder="6-digit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <WizardNav step={step} submitting={submitting} onBack={onBack} onSkip={onSkip} />
      </form>
    </Form>
  );
}
