import Referrals from "@/components/referrals";
import { ComingSoon } from "@/components/reusable/coming-soon";

export default function Page() {
  return (
    // <ComingSoon
    //   title="Referrals"
    //   description="Invite friends and earn rewards together. Share your unique referral code, track your referrals, and unlock special bonuses when your friends join and participate in surveys."
    //   eta="Q2 2025"
    //   backUrl="/dashboard"
    // />
    <div className="md:px-10 pb-16 py-8 px-5">
      <Referrals />
    </div>
  );
}
