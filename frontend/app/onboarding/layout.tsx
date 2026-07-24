import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete your profile",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-section px-4 py-10 sm:py-14">{children}</main>
  );
}
