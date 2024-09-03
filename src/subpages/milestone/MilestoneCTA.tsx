"use client";

import React from "react";
import { BsPlusCircle } from "react-icons/bs";
import { usePathname } from "next/navigation";

const MilestoneCTA = () => {
  const pathname = usePathname();
  if (pathname !== "/milestone") {
    return null;
  }

  return (
    <div className="flex justify-between items-center gap-3 pb-3 px-4 sm:px-6 lg:px-8">
      <button
        className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] rounded-lg px-3 py-2 text-white text-[16px] font-medium leading-6 text-center font-inter justify-center"
        type="button"
      >
        Create Survey <BsPlusCircle className="inline-block" />
      </button>
      <button
        className="text-[16px] rounded-lg px-3 py-2 font-medium leading-6 text-center font-inter border border-[#9d50bb] justify-center text-[#5b03b2]"
        type="button"
      >
        Created Surveys
      </button>
    </div>
  );
};

export default MilestoneCTA;
