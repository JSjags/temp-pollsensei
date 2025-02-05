import { ComingSoon } from "@/components/reusable/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Survey settings"
      description="Customize your survey preferences and notification settings. Control how you receive survey invitations, set your availability, and manage your survey-taking experience to match your schedule and interests."
      eta="Q2 2025"
      backUrl="/dashboard"
    />
  );
}
