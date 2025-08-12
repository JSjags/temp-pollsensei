"use client";
import Image from "next/image";
import earn from "@/assets/images/earn.png";

const BannerNote = () => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] px-3 lg:px-4 py-2 w-full lg:w-[400px] rounded-lg border border-[#F0F2F580] overflow-hidden relative">
      <p className="text-[10px] lg:text-xs text-white/80 w-[60%] z-50">
        Participate in any of the activities such as Watching Ads, Filling
        Surveys and Following us on social media to earn more coins
      </p>
      <Image
        src={earn}
        width={200}
        height={300}
        alt="Earn coins illustration"
        className="absolute top-0 -right-10 lg:right-0"
      />
    </div>
  );
};
export default BannerNote;
