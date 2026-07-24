"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WizardNav } from "@/features/onboarding/components/wizard-nav";
import {
  academicSchema,
  type AcademicFormValues,
} from "@/features/onboarding/schemas/academic.schema";
import {
  ACADEMIC_STATUS_OPTIONS,
  ADMISSION_YEARS,
  BRANCH_OPTIONS,
  COURSE_OPTIONS,
  PASSING_YEARS,
  SEMESTER_OPTIONS,
  YEAR_OPTIONS,
  YES_NO_OPTIONS,
} from "@/features/onboarding/constants";

interface AcademicStepProps {
  defaultValues: Partial<AcademicFormValues>;
  submitting: boolean;
  step: number;
  onSubmit: (values: AcademicFormValues) => void;
  onBack: () => void;
  onSkip: () => void;
}

type Opt = { value: string; label: string };

export function AcademicStep({
  defaultValues,
  submitting,
  step,
  onSubmit,
  onBack,
  onSkip,
}: AcademicStepProps) {
  const form = useForm<AcademicFormValues>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      enrollmentNumber: "",
      universityRollNumber: "",
      course: "",
      branch: "",
      currentYear: "",
      currentSemester: "",
      section: "",
      admissionYear: "",
      expectedPassingYear: "",
      tenthPercentage: "",
      twelfthPercentage: "",
      diplomaPercentage: "",
      currentCgpa: "",
      activeBacklogs: "",
      totalBacklogsHistory: "",
      academicGap: "",
      academicStatus: "",
      ...defaultValues,
    },
  });

  const textField = (
    name: keyof AcademicFormValues,
    label: string,
    placeholder?: string,
    inputMode?: "numeric" | "text"
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              inputMode={inputMode}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const selectField = (
    name: keyof AcademicFormValues,
    label: string,
    options: readonly Opt[],
    placeholder = "Select"
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
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
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {textField("enrollmentNumber", "Enrollment Number", "e.g. SAITM2023001")}
          {textField("universityRollNumber", "University Roll No.", "e.g. 2100320100001", "numeric")}
          {selectField("course", "Course", COURSE_OPTIONS)}
          {selectField("branch", "Branch", BRANCH_OPTIONS)}
          {selectField("currentYear", "Current Year", YEAR_OPTIONS)}
          {selectField("currentSemester", "Current Semester", SEMESTER_OPTIONS)}
          {textField("section", "Section", "e.g. A")}
          {selectField("admissionYear", "Admission Year", ADMISSION_YEARS)}
          {selectField("expectedPassingYear", "Expected Passing Year", PASSING_YEARS)}
          {textField("tenthPercentage", "10th Percentage", "e.g. 88.4", "numeric")}
          {textField("twelfthPercentage", "12th Percentage", "e.g. 84.0", "numeric")}
          {textField("diplomaPercentage", "Diploma % (if any)", "Optional", "numeric")}
          {textField("currentCgpa", "Current CGPA", "e.g. 8.2", "numeric")}
          {textField("activeBacklogs", "Active Backlogs", "e.g. 0", "numeric")}
          {textField("totalBacklogsHistory", "Total Backlogs (history)", "e.g. 1", "numeric")}
          {selectField("academicGap", "Academic Gap?", YES_NO_OPTIONS)}
          {selectField("academicStatus", "Academic Status", ACADEMIC_STATUS_OPTIONS)}
        </div>

        <WizardNav step={step} submitting={submitting} onBack={onBack} onSkip={onSkip} />
      </form>
    </Form>
  );
}
