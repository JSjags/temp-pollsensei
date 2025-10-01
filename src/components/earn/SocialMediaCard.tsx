"use client";
import React, { useState } from "react";
import Image from "next/image";
import Coin from "@/assets/images/Coin.png";
import XIcon from "@/assets/images/referrals/X.svg";
import facebookIcon from "@/assets/images/referrals/Facebook.svg";
import tiktokIcon from "@/assets/images/referrals/Tiktok.svg";
import instagramIcon from "@/assets/images/referrals/Instagram.svg";
import youtubeIcon from "@/assets/images/referrals/Youtube.svg";
import linkedinIcon from "@/assets/images/referrals/LinkedIn.svg";
import { Button } from "@/components/ui/button";
import { CongratulationsDialog } from "@/components/earn/CongratulationsDialog";
import logoGold from "@/assets/images/logo-gold.png";

const SocialMediaCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [claimedSocials, setClaimedSocials] = useState<number[]>([]);

  const socials = [
    { name: "X (Formerly Twitter)", icon: XIcon, link: "https://x.com/claim" },
    {
      name: "Facebook",
      icon: facebookIcon,
      link: "https://www.facebook.com/claim",
    },
    {
      name: "LinkedIn",
      icon: linkedinIcon,
      link: "https://www.linkedin.com/claim",
    },
    { name: "Tiktok", icon: tiktokIcon, link: "https://www.tiktok.com/claim" },
    {
      name: "Instagram",
      icon: instagramIcon,
      link: "https://www.instagram.com/claim",
    },
    {
      name: "Youtube",
      icon: youtubeIcon,
      link: "https://www.youtube.com/claim",
    },
  ];

  const handleClaim = (index: number) => {
    if (!claimedSocials.includes(index)) {
      setClaimedSocials([...claimedSocials, index]);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <CongratulationsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        coins={100}
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3">
        {socials.map((social, index) => {
          const isClaimed = claimedSocials.includes(index);

          return (
            <div
              key={index}
              className="bg-white border border-[#5B03B21A] px-3 py-2 flex items-center justify-between gap-3 rounded-lg"
            >
              <div className="w-[80%] flex items-center gap-2">
                <Image
                  src={social.icon}
                  width={40}
                  height={40}
                  alt="social icon"
                />
                <div className="flex flex-row items-center flex-wrap text-xs text-[#767171]">
                  Follow us on {social.name} to Claim{" "}
                  <div className="flex items-center gap-1">
                    <Image
                      src={logoGold}
                      width={15}
                      height={15}
                      alt="pollcoin"
                    />
                    <p className="text-sm text-[#5B03B2] font-bold">100</p>
                  </div>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                // disabled={isClaimed}
                disabled
                onClick={() => handleClaim(index)}
                className={`${
                  isClaimed
                    ? "bg-transparent border border-[#969697] text-[#969697]"
                    : "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
                } w-24 h-8 p-0 rounded-xl text-xs`}
              >
                {isClaimed ? "Claimed" : "Claim"}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default SocialMediaCard;
