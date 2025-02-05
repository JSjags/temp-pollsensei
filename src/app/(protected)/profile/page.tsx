import { ComingSoon } from "@/components/reusable/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Profile"
      description="View and update your personal information, preferences, and survey profile. Manage your account details, track your participation history, and customize your survey-taking experience."
      eta="Q2 2025"
      backUrl="/dashboard"
    />
  );
}
