"use client";

import { IoArrowBackSharp, IoCheckmarkDoneCircle, IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import BreadcrumsIcon from "../ui/BreadcrumsIcon";
import Image from "next/image";
import { hypen } from "@/assets/images";
import { usePathname, useRouter } from "next/navigation";

const SurveyCreationNav = () => {
  const path = usePathname();
  const router = useRouter();
  const isExactSurveyPath = path === "/surveys";
  const isSurveySubpath = path.startsWith("/surveys") && isExactSurveyPath;

  if (isSurveySubpath) {
    return null;
  }

  return (
    <div className="px-5 md:px-20 py-3 border-b-2 md:flex justify-between items-center">
      <button
        className="border-none flex items-center"
        onClick={() => router.back()}
      >
        <IoArrowBackSharp className="mr-3" /> Back
      </button>

      <nav className="flex justify-between flex-wrap items-center">
        <Link href={""} className="flex items-center">
          <BreadcrumsIcon icon={<IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />} />
          <span className="ml-3 text-sm ">Design</span>
        </Link>
        <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
        <Link href={""} className="flex items-center">
          <BreadcrumsIcon color="#B0A5BB" />
          <span className="ml-3 text-sm ">Reponses</span>
        </Link>
        <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
        <Link href={""} className="flex items-center">
          <BreadcrumsIcon color="#B0A5BB" />
          <span className="ml-3 text-sm ">Validation</span>
        </Link>
        <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
        <Link href={""} className="flex items-center">
          <BreadcrumsIcon color="#B0A5BB" />
          <span className="ml-3 text-sm ">Analysis</span>
        </Link>
        <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
        <Link href={""} className="flex items-center">
          <BreadcrumsIcon color="#B0A5BB" />
          <span className="ml-3 text-sm ">Report</span>
        </Link>
        <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
      </nav>

      <button className="border-none flex items-center">
        <IoSettingsOutline className="mr-3" /> Survey Settings
      </button>
    </div>
  );
};

export default SurveyCreationNav;
