"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import {
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsShare } from "react-icons/bs";

interface ShareModalProps {
  reportTitle: string;
  reportUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

// Add type for social media keys
type SocialMediaKey =
  | "whatsapp"
  | "twitter"
  | "linkedin"
  | "facebook"
  | "telegram"
  | "gmail";

const ShareModal: React.FC<ShareModalProps> = ({
  reportTitle,
  reportUrl,
  isOpen,
  onClose,
}) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const socialMediaShareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${reportTitle} ${reportUrl}`
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      reportUrl
    )}&text=${encodeURIComponent(reportTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      reportUrl
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      reportUrl
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      reportUrl
    )}&text=${encodeURIComponent(reportTitle)}`,
    gmail: `mailto:?subject=${encodeURIComponent(
      reportTitle
    )}&body=${encodeURIComponent(`Check out this report: ${reportUrl}`)}`,
  };

  const handleCopySuccess = () => {
    setLinkCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    toast.success(`Opening ${platform} share!`);
    // Close modal after a brief delay to allow the share window to open
    setTimeout(() => onClose(), 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <BsShare className="w-5 h-5 text-gray-600" />
            Share Report
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-xl mx-auto w-full">
          <div className="space-y-6">
            {/* Report Title */}
            <div className="text-center">
              <h3 className="font-semibold text-sm text-gray-700 mb-4 line-clamp-2">
                {reportTitle}
              </h3>
            </div>

            {/* Copy Link Section */}
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm font-medium">Copy Link</p>
              <div className="w-full flex border rounded-lg overflow-hidden hover:border-purple-300 transition-colors">
                <input
                  type="text"
                  value={reportUrl}
                  readOnly
                  className="p-3 border-0 ring-0 w-3/4 bg-gray-50 text-sm focus:outline-none"
                />
                <CopyToClipboard text={reportUrl} onCopy={handleCopySuccess}>
                  <button
                    className={`w-1/4 font-medium text-sm transition-colors ${
                      linkCopied
                        ? "bg-green-50 text-green-600"
                        : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                    }`}
                  >
                    {linkCopied ? "Copied!" : "Copy"}
                  </button>
                </CopyToClipboard>
              </div>
            </div>

            {/* Share via Social Media */}
            <div className="flex flex-col gap-3">
              <p className="text-gray-500 text-sm font-medium">Share via</p>
              <div className="flex gap-4 items-center justify-center">
                {Object.entries({
                  whatsapp: [FaWhatsapp, "text-green-500 hover:text-green-600"],
                  twitter: [FaXTwitter, "text-gray-800 hover:text-gray-900"],
                  linkedin: [FaLinkedin, "text-blue-600 hover:text-blue-700"],
                  gmail: [FaEnvelope, "text-red-500 hover:text-red-600"],
                  facebook: [FaFacebook, "text-blue-600 hover:text-blue-700"],
                  telegram: [FaTelegram, "text-blue-500 hover:text-blue-600"],
                }).map(([key, [Icon, className]]) => (
                  <Link
                    key={key}
                    href={socialMediaShareUrls[key as SocialMediaKey]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-transform hover:scale-110 ${className} p-2 rounded-full hover:bg-gray-50`}
                    onClick={() => handleSocialShare(key)}
                  >
                    <Icon size={28} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
