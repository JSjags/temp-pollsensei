import { ComingSoon } from "@/components/reusable/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Payouts"
      description="View and manage your earned rewards. Track your payment history, withdraw your earnings, and choose from multiple payout methods to receive compensation for your valuable contributions."
      eta="Q2 2025"
      backUrl="/dashboard"
    />
  );
}
