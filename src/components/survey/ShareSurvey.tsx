"use client";
"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { FaXTwitter } from "react-icons/fa6";
import {
  useDownloadPDFQuery,
  useShareSurveyQuery,
  useLazyShareSurveyQuery,
} from "@/services/survey.service";
import { Skeleton } from "../ui/skeleton";

interface ShareSurveyProps {
  onClick?: () => void;
  _id?: string;
}

// Add type for social media keys
type SocialMediaKey =
  | "whatsapp"
  | "twitter"
  | "linkedin"
  | "facebook"
  | "telegram"
  | "gmail";

const ShareSurvey: React.FC<ShareSurveyProps> = ({ onClick, _id }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const {
    data,
    isSuccess,
    isLoading: pdfLoading,
  } = useDownloadPDFQuery(params.id || _id);
  const {
    data: share,
    isSuccess: shareSuccess,
    isLoading: shareLoading,
  } = useShareSurveyQuery(params.id || _id);
  const [shareLazyLink, { data: shareLazyData }] = useLazyShareSurveyQuery();

  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://pollsensei.ai";
  const [currentUrl, setCurrentUrl] = useState("");
  const shareLink = share?.data?.link;
  const share_embed_link = share?.data?.embed_link;

  useEffect(() => {
    const fullUrl = `${domain}${pathname}`;
    setCurrentUrl(fullUrl);
  }, [domain, pathname]);

  const embedLink = `<iframe src="${share_embed_link}" width="600" height="400"></iframe>`;

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

  return (
    <div className="rounded-xl mx-auto w-full">
      {/* {onClick && (
        <div className="flex justify-end mb-2" onClick={onClick}>
          <FaTimes className="w-5 h-5 p-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full cursor-pointer" />
        </div>
      )} */}

      {/* <h3 className="text-2xl font-bold mb-6 text-gray-800">Share Survey</h3> */}

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-gray-500 text-sm font-medium">Copy Link</p>
          {shareLoading ? (
            <Skeleton className="h-11 w-full" />
          ) : (
            <div className="w-full flex border rounded-lg overflow-hidden hover:border-purple-300 transition-colors">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="p-3 border-0 ring-0 w-3/4 bg-gray-50"
              />
              <CopyToClipboard
                text={shareLink}
                onCopy={() => setLinkCopied(true)}
              >
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
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-gray-500 text-sm font-medium">Share via</p>
          {shareLoading ? (
            <div className="flex gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 items-center">
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
                  className={`transition-transform hover:scale-110 ${className}`}
                >
                  <Icon size={32} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-gray-500 text-sm font-medium">Embed Link</p>
          {shareLoading ? (
            <Skeleton className="h-11 w-full" />
          ) : (
            <div className="w-full flex border rounded-lg overflow-hidden hover:border-purple-300 transition-colors">
              <input
                type="text"
                value={embedLink}
                readOnly
                className="p-3 border-0 ring-0 w-3/4 bg-gray-50"
              />
              <CopyToClipboard
                text={embedLink}
                onCopy={() => setEmbedCopied(true)}
              >
                <button
                  className={`w-1/4 font-medium text-sm transition-colors ${
                    embedCopied
                      ? "bg-green-50 text-green-600"
                      : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  {embedCopied ? "Copied!" : "Copy"}
                </button>
              </CopyToClipboard>
            </div>
          )}
        </div>

        <div>
          {pdfLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <Link
              href={data && isSuccess ? data?.data?.url : ""}
              target="blank"
              download
              className="block"
            >
              <button className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-lg gap-2">
                <GoDownload size={20} />
                Download as PDF
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareSurvey;
