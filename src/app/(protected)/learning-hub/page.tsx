import { ComingSoon } from "@/components/reusable/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Learning hub"
      description="Access educational resources and enhance your survey-taking skills. Learn best practices, get tips for providing quality responses, and stay updated with the latest survey methodologies and guidelines."
      eta="Q2 2025"
      backUrl="/dashboard"
    />
  );
}
