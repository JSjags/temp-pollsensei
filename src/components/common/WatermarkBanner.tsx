import React from "react";
import Image from "next/image";
import { pollsensei_new_logo } from "@/assets/images";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface WatermarkBannerProps {
  className?: string;
}

const WatermarkBanner: React.FC<WatermarkBannerProps> = ({
  className = "",
}) => {
  const router = useRouter();
  const subscription = useSelector(
    (state: RootState) => state.user.user?.plan.name
  );

  if (subscription !== "Basic Plan") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#5B03B21A] rounded-md flex flex-col justify-center items-center py-5 text-center relative ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-600">Form created by</p>
        <Image
          src={pollsensei_new_logo}
          alt="PollSensei Logo"
          className="h-8 w-auto"
        />
      </div>
      <Button
        variant="link"
        className="absolute bottom-2 right-4 text-[#828282] hover:text-[#5B03B2] transition-colors"
        onClick={() => router.push("/settings/subscription")}
      >
        Remove watermark
      </Button>
    </motion.div>
  );
};

export default WatermarkBanner;
