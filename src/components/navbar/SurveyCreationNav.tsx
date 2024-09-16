"use client";

import {
  IoArrowBackSharp,
  IoCheckmarkDoneCircle,
  IoSettingsOutline,
  IoEyeOutline,
} from "react-icons/io5";
import Link from "next/link";
import BreadcrumsIcon from "../ui/BreadcrumsIcon";
import Image from "next/image";
import { hypen } from "@/assets/images";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useFetchASurveyQuery } from "@/services/survey.service";
import { color } from "framer-motion";
import { useDispatch } from "react-redux";
import { closeUpload, openUpload, toggleUpload } from "@/redux/slices/upload.slice";



const SurveyCreationNav = () => {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch()
  const isExactSurveyPath = path === "/surveys";
  const isSurveySubpath = path.startsWith("/surveys") && isExactSurveyPath;
  const params = useParams();
  const { data } = useFetchASurveyQuery(params.id);

  if (isSurveySubpath) {
    return null;
  }



  console.log(data?.data);

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
          <BreadcrumsIcon
            icon={
              <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
            }
          />
          <span className="ml-3 text-sm ">Design</span>
        </Link>
        <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
        <Link
          href={
            data?.data.sections.length > 0
              ? `/surveys/${data?.data._id}/survey-reponse-upload`
              : ""
          }
          className="flex items-center"
        >
          <BreadcrumsIcon
            icon={
              data?.data.sections.length > 0 && (
                <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
              )
            }
            color={data?.data.sections === undefined ? "#B0A5BB" : ""}
          />
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

      {path.includes("survey-reponse-upload") ? (
        <button className="flex items-center justify-center gap-4 text-white text-[1rem] rounded-md px-[3rem] py-3  bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]" onClick={()=>{
          dispatch(openUpload())
        }}>
          Upload Results
        </button>
      ) : (
        <div className="flex justify-between items-center gap-3">
          {path === "/surveys/create-survey" ||
          path === "/surveys/add-question-m" ? (
            " "
          ) : (
            <button
              className={`border-none flex items-center ${
                path === "/surveys/preview-survey" ? "invisible" : "visible"
              }`}
              onClick={() => {
                router.push("/surveys/preview-survey");
              }}
            >
              <IoEyeOutline className="mr-1" /> Preview
            </button>
          )}
          <button className="border-none flex items-center">
            <IoSettingsOutline className="mr-1" /> Survey Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default SurveyCreationNav;
