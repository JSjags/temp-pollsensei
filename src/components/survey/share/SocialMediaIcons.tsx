import Link from "next/link";
import {
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { SocialMediaKey } from "./types";

interface Props {
  shareLink: string;
  isLoading: boolean;
}

export function SocialMediaIcons({ shareLink, isLoading }: Props) {
  const socialMediaShareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareLink)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareLink
    )}&text=Check+out+this+survey!`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      shareLink
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareLink
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      shareLink
    )}&text=Check+out+this+survey!`,
    gmail: `mailto:?subject=Check%20this%20survey&body=${encodeURIComponent(
      shareLink
    )}`,
  };

  if (isLoading) {
    return (
      <div className="flex gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-full" />
        ))}
      </div>
    );
  }

  const socialIcons = {
    whatsapp: [FaWhatsapp, "text-green-500 hover:text-green-600"],
    twitter: [FaXTwitter, "text-gray-800 hover:text-gray-900"],
    linkedin: [FaLinkedin, "text-blue-600 hover:text-blue-700"],
    gmail: [FaEnvelope, "text-red-500 hover:text-red-600"],
    facebook: [FaFacebook, "text-blue-600 hover:text-blue-700"],
    telegram: [FaTelegram, "text-blue-500 hover:text-blue-600"],
  };

  return (
    <div className="flex gap-4 items-center">
      {Object.entries(socialIcons).map(([key, [Icon, className]]) => (
        <Link
          key={key}
          href={socialMediaShareUrls[key as SocialMediaKey]}
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-transform hover:scale-110 ${className}`}
        >
          <Icon size={32} />
        </Link>
      ))}
    </div>
  );
}
