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
    <main className="page-gutter min-h-safe-screen bg-section py-8 pb-safe sm:py-14">
      {children}
    </main>
  );
}
