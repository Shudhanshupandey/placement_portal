"use client";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Linkedin, Globe, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/features/onboarding/components/tag-input";
import { WizardNav } from "@/features/onboarding/components/wizard-nav";
import {
  professionalSchema,
  type ProfessionalFormValues,
} from "@/features/onboarding/schemas/professional.schema";

interface ProfessionalStepProps {
  defaultValues: Partial<ProfessionalFormValues>;
  submitting: boolean;
  step: number;
  onSubmit: (values: ProfessionalFormValues) => void;
  onBack: () => void;
  onSkip: () => void;
}

const SKILL_SUGGESTIONS = ["Problem Solving", "DSA", "System Design", "Git", "SQL"];
const LANG_SUGGESTIONS = ["C++", "Java", "Python", "JavaScript", "TypeScript", "C"];
const FRAMEWORK_SUGGESTIONS = ["React", "Next.js", "Node.js", "Spring Boot", "Django"];
const TECH_SUGGESTIONS = ["Firebase", "AWS", "Docker", "MongoDB", "PostgreSQL"];

export function ProfessionalStep({
  defaultValues,
  submitting,
  step,
  onSubmit,
  onBack,
  onSkip,
}: ProfessionalStepProps) {
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      skills: [],
      programmingLanguages: [],
      frameworks: [],
      technologies: [],
      certifications: [],
      projects: [],
      internshipExperience: "",
      workExperience: "",
      github: "",
      linkedin: "",
      portfolio: "",
      leetcode: "",
      hackerrank: "",
      codechef: "",
      codeforces: "",
      ...defaultValues,
    },
  });

  const projects = useFieldArray({ control: form.control, name: "projects" });

  const tagField = (
    name: "skills" | "programmingLanguages" | "frameworks" | "technologies" | "certifications",
    label: string,
    placeholder: string,
    suggestions: string[] = []
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={placeholder}
              suggestions={suggestions}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const linkField = (
    name: "github" | "linkedin" | "portfolio" | "leetcode" | "hackerrank" | "codechef" | "codeforces",
    label: string,
    placeholder: string,
    icon?: React.ReactNode
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {icon && (
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {icon}
                </span>
              )}
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={placeholder}
                className={icon ? "pl-9" : undefined}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {tagField("skills", "Skills", "Add a skill", SKILL_SUGGESTIONS)}
            {tagField("programmingLanguages", "Programming Languages", "Add a language", LANG_SUGGESTIONS)}
            {tagField("frameworks", "Frameworks", "Add a framework", FRAMEWORK_SUGGESTIONS)}
            {tagField("technologies", "Technologies", "Add a technology", TECH_SUGGESTIONS)}
            {tagField("certifications", "Certifications", "Add a certification")}
          </div>

          {/* Projects repeater */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel>Projects</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => projects.append({ title: "", description: "", link: "" })}
              >
                <Plus /> Add project
              </Button>
            </div>

            {projects.fields.length === 0 && (
              <p className="rounded-lg border border-dashed border-border bg-section px-4 py-3 text-sm text-muted-foreground">
                No projects added yet. Showcase your best work to recruiters.
              </p>
            )}

            {projects.fields.map((f, i) => (
              <div key={f.id} className="rounded-xl border border-border bg-section/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-heading">Project {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => projects.remove(i)}
                    className="text-muted-foreground hover:text-error"
                    aria-label="Remove project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`projects.${i}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Project title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${i}.link`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} placeholder="Live/GitHub link (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${i}.description`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormControl>
                          <Textarea {...field} value={field.value ?? ""} rows={2} placeholder="What did you build? (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="internshipExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internship Experience</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} rows={3} placeholder="Company, role, duration…" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Experience</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} rows={3} placeholder="Any prior work experience…" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {linkField("github", "GitHub", "github.com/username", <Github className="h-4 w-4" />)}
            {linkField("linkedin", "LinkedIn", "linkedin.com/in/username", <Linkedin className="h-4 w-4" />)}
            {linkField("portfolio", "Portfolio", "yoursite.com", <Globe className="h-4 w-4" />)}
            {linkField("leetcode", "LeetCode", "leetcode.com/u/username")}
            {linkField("hackerrank", "HackerRank", "hackerrank.com/username")}
            {linkField("codechef", "CodeChef", "codechef.com/users/username")}
            {linkField("codeforces", "Codeforces", "codeforces.com/profile/username")}
          </div>
        </div>

        <WizardNav step={step} submitting={submitting} onBack={onBack} onSkip={onSkip} />
      </form>
    </Form>
  );
}
