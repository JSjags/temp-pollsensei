import {
  Facebook,
  Instagram,
  LinkedIn,
  Tiktok,
  X,
  Youtube,
} from "@/assets/images";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const firstHalf = Socials.slice(0, 3);
  const secondHalf = Socials.slice(3, 6);
  return (
    <div className="mt-5 flex flex-col gap-3">
      <p className="text-lg font-bold">
        Follow us on social media to earn coins
      </p>
      <div className="flex items-center w-full justify-between bg-[#E6E2F833] rounded-[20px] py-3 md:px-[54px] gap-3 max-md:flex-col-reverse">
        {/* <div className="flex items-center w-[55%] justify-between"> */}
        <div className="flex gap-3 items-center">
          {firstHalf.map((social, index) => (
            <Link
              href={social.path}
              key={`Socials-1-${index}`}
              className="hover:scale-105 transition duration-300 ease-in-out"
            >
              <Image src={social.icon} alt="social link" />
            </Link>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          {secondHalf.map((social, index) => (
            <Link
              href={social.path}
              key={`Social-2-${index}`}
              className="hover:scale-105 transition duration-300 ease-in-out"
            >
              <Image src={social.icon} alt="social link" />
            </Link>
          ))}
        </div>
        <div className="border border-[#5B03B24D] shadow-[0px_4px_20px_1px_#5B03B20D] py-3 px-5 rounded-[10px]">
          <p className="max-w-[237px] text-new-tertiary">
            Earn 100Pollcoins for following us on any social media platform
          </p>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

const Socials = [
  {
    path: "",
    icon: Facebook,
  },
  {
    path: "",
    icon: LinkedIn,
  },
  {
    path: "",
    icon: X,
  },
  {
    path: "",
    icon: Instagram,
  },
  {
    path: "",
    icon: Tiktok,
  },
  {
    path: "",
    icon: Youtube,
  },
];
