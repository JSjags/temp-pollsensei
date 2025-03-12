import { ComingSoon } from "@/components/reusable/coming-soon";
import Shop from "@/components/shop";

export default function Page() {
  return (
    // <ComingSoon
    //   title="Shop"
    //   description="Shop for exclusive rewards and merchandise using your earned points. Browse our curated collection of items, redeem your rewards, and enjoy the benefits of your participation."
    //   eta="Q2 2025"
    //   backUrl="/dashboard"
    // />
    <div className="px-10">
      <Shop />
    </div>
  );
}
