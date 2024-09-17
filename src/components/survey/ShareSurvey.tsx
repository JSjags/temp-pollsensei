"use client"

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { FaXTwitter } from "react-icons/fa6";
import { useDownloadPDFQuery, useShareSurveyQuery } from "@/services/survey.service";

interface ShareSurveyProps{
  onClick?:()=>void;
  _id?: string
}

const ShareSurvey: React.FC<ShareSurveyProps> = ({onClick, _id}) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const {data, isSuccess } = useDownloadPDFQuery(params.id || _id)
  const {data:share, isSuccess:shareSuccess } = useShareSurveyQuery(params.id || _id)


  const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  const [currentUrl, setCurrentUrl] = useState("");
  const shareLink = share?.data?.link
  const share_embed_link = share?.data?.embed_link
  console.log(currentUrl)

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
    <div className="p-6 border border-gray-300 rounded-lg max-w-md mx-auto bg-white shadow-md">
      <div className="flex justify-end" onClick={onClick}>
        <FaTimes className="w-4 h-4 bg-[#E5E5E5] rounded-full" />
      </div>
      <h3 className="text-xl font-semibold mb-4">Share Survey</h3>
      <div className="flex flex-col gap-2 justify-start">
        <p className='text-[#838383] text-sm'>Copy Link</p>
        <div className="mb-6 w-full flex border rounded">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="p-2 border-0 ring-0 rounded w-3/4"
          />
          <CopyToClipboard text={shareLink} onCopy={() => setLinkCopied(true)}>
            <button
              className={`rounded w-1/4 transition font-normal text-sm ${
                linkCopied ? "text-red-500" : "text-[#5B03B2]"
              }`}
            >
              {linkCopied ? "Copied!" : "Copy"}
            </button>
          </CopyToClipboard>
        </div>
      </div>


      {/* Embed Link Section */}
      <div className="flex flex-col gap-2 justify-start">
      <p className='text-[#838383] text-sm'>Share via</p>
           {/* Social Media Share Section */}
           <div className="flex gap-3 items-center mb-6">
        <Link
          href={socialMediaShareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500"
        >
          <FaWhatsapp size={30} />
        </Link>
        <Link
          href={socialMediaShareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black"
        >
          <FaXTwitter size={30} />
        </Link>
        <Link
          href={socialMediaShareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 rounded-full"
        >
          <FaLinkedin size={30} />
        </Link>
        <Link
          href={socialMediaShareUrls.gmail}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500"
        >
          <FaEnvelope size={30} />
        </Link>
        <Link
          href={socialMediaShareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          <FaFacebook size={30} />
        </Link>
        <Link
          href={socialMediaShareUrls.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          <FaTelegram size={30} />
        </Link>
      </div>
      </div>

            {/* Embed Link Section */}
            <div className="flex flex-col gap-2 justify-start">
      <p className='text-[#838383] text-sm'>Embed Link</p>
      <div className="mb-6 w-full flex border rounded">
        <input
          type="text"
          value={embedLink}
          readOnly
           className="p-2 border-0 ring-0 rounded w-3/4"
        />
        <CopyToClipboard text={embedLink} onCopy={() => setEmbedCopied(true)}>
          <button 
          className={`rounded w-1/4 transition font-normal text-sm ${
            embedCopied ? "text-red-500" : "text-[#5B03B2]"
          }`}
          >
            {embedCopied ? "Copied!" : "Copy"}
          </button>
        </CopyToClipboard>
      </div>
      </div>

      {/* Download PDF Section */}
      <div>
        <Link href={data && isSuccess ? data?.data?.url : ""} target="blank" download className="block">
          <button className="w-full flex items-center p-2 bg-[#FAFAFA] text-[#5B03B2] rounded hover:bg-[#b2b1b1] transition font-normal text-[1.15rem]">
          <GoDownload className="mr-3" />  Download as PDF
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ShareSurvey;
