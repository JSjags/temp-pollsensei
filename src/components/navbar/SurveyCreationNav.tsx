// "use client";

// import {
//   IoArrowBackSharp,
//   IoCheckmarkDoneCircle,
//   IoSettingsOutline,
//   IoEyeOutline,
// } from "react-icons/io5";
// import Link from "next/link";
// import BreadcrumsIcon from "../ui/BreadcrumsIcon";
// import Image from "next/image";
// import { hypen } from "@/assets/images";
// import { useParams, usePathname, useRouter } from "next/navigation";
// import { useFetchASurveyQuery } from "@/services/survey.service";
// import { color } from "framer-motion";
// import { useDispatch } from "react-redux";
// import { closeUpload, openUpload, toggleUpload } from "@/redux/slices/upload.slice";

// const SurveyCreationNav = () => {
//   const path = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch()
//   const isExactSurveyPath = path === "/surveys";
//   const isSurveySubpath = path.startsWith("/surveys") && isExactSurveyPath;
//   const params = useParams();
//   const { data } = useFetchASurveyQuery(params.id);

//   if (isSurveySubpath) {
//     return null;
//   }

//   console.log(data?.data);

//   return (
//     <div className="px-5 md:px-20 py-3 border-b-2 md:flex justify-between items-center">
//       <button
//         className="border-none flex items-center"
//         onClick={() => router.back()}
//       >
//         <IoArrowBackSharp className="mr-3" /> Back
//       </button>

//       <nav className="flex justify-between flex-wrap items-center">
//         <Link href={""} className="flex items-center">
//           <BreadcrumsIcon
//             icon={
//               <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
//             }
//           />
//           <span className="ml-3 text-sm ">Design</span>
//         </Link>
//         <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//         <Link
//           href={
//             data?.data.sections.length > 0
//               ? `/surveys/${data?.data._id}/survey-reponse-upload`
//               : ""
//           }
//           className="flex items-center"
//         >
//           <BreadcrumsIcon
//             icon={
//               data?.data.sections.length > 0 && (
//                 <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
//               )
//             }
//             color={data?.data.sections === undefined ? "#B0A5BB" : ""}
//           />
//           <span className="ml-3 text-sm ">Reponses</span>
//         </Link>
//         <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//         <Link href={""} className="flex items-center">
//           <BreadcrumsIcon color="#B0A5BB" />
//           <span className="ml-3 text-sm ">Validation</span>
//         </Link>
//         <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//         <Link href={""} className="flex items-center">
//           <BreadcrumsIcon color="#B0A5BB" />
//           <span className="ml-3 text-sm ">Analysis</span>
//         </Link>
//         <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//         <Link href={""} className="flex items-center">
//           <BreadcrumsIcon color="#B0A5BB" />
//           <span className="ml-3 text-sm ">Report</span>
//         </Link>
//         <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//       </nav>

//       {path.includes("survey-reponse-upload") ? (
//         <button className="flex items-center justify-center gap-4 text-white text-[1rem] rounded-md px-[3rem] py-3  bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]" onClick={()=>{
//           dispatch(openUpload())
//         }}>
//           Upload Results
//         </button>
//       ) : (
//         <div className="flex justify-between items-center gap-3">
//           {path === "/surveys/create-survey" ||
//           path === "/surveys/add-question-m" ? (
//             " "
//           ) : (
//             <button
//               className={`border-none flex items-center ${
//                 path === "/surveys/preview-survey" ? "invisible" : "visible"
//               }`}
//               onClick={() => {
//                 router.push("/surveys/preview-survey");
//               }}
//             >
//               <IoEyeOutline className="mr-1" /> Preview
//             </button>
//           )}
//           <button className="border-none flex items-center">
//             <IoSettingsOutline className="mr-1" /> Survey Settings
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SurveyCreationNav;

// Isaac's implementation

// "use client";

// import {
//   IoArrowBackSharp,
//   IoCheckmarkDoneCircle,
//   IoSettingsOutline,
//   IoEyeOutline,
// } from "react-icons/io5";
// import Link from "next/link";
// import BreadcrumsIcon from "../ui/BreadcrumsIcon";
// import Image from "next/image";
// import { hypen } from "@/assets/images";
// import { useParams, usePathname, useRouter } from "next/navigation";
// import { useFetchASurveyQuery } from "@/services/survey.service";
// import { useDispatch } from "react-redux";
// import { openUpload } from "@/redux/slices/upload.slice";
// import { FiShare2 } from "react-icons/fi";
// import ShareSurvey from "../survey/ShareSurvey";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getSurveyResponses } from "@/services/analysis";
// import { extractMongoId } from "@/lib/utils";

// const SurveyCreationNav = () => {
//   const path = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const params = useParams();
//   const { data } = useFetchASurveyQuery(params.id);
//   const [shareSurvey, setShareSurvey] = useState(false);

//   const activeLink = path.includes("survey-reponse-upload")
//     ? "Reponses"
//     : path.includes("preview-survey")
//     ? "Preview"
//     : path.includes("validation")
//     ? "Validation"
//     : "Design";

//   const isExactSurveyPath = path === "/surveys";
//   const isSurveySubpath = path.startsWith("/surveys") && isExactSurveyPath;

//   if (isSurveySubpath) {
//     return null;
//   }

//   const surveyId = extractMongoId(path);

//   const surveyResponses = useQuery({
//     queryKey: ["get-survey-responses"],
//     queryFn: () => getSurveyResponses({ surveyId: surveyId! }),
//     enabled: surveyId !== undefined,
//   });

//   return (
//     !path.includes("survey-list") && (
//       <div className="px-5 md:px-1 lg:px-20 py-3 border-b-2 flex justify-between items-center">
//         <button
//           className="border-none flex items-center"
//           onClick={() => router.back()}
//         >
//           <IoArrowBackSharp className="mr-3" /> Back
//         </button>

//         {/* Small screen: Only display active link */}
//         <nav className="block md:hidden">
//           <Link href={""} className="flex items-center">
//             <BreadcrumsIcon
//               icon={
//                 <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
//               }
//             />
//             <span className="ml-3 text-sm">{activeLink}</span>
//           </Link>
//         </nav>

//         {/* Medium and Large screens: Show all links */}
//         <nav className="hidden md:flex justify-between flex-wrap items-center">
//           <Link href={""} className="flex items-center">
//             <BreadcrumsIcon
//               icon={
//                 <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
//               }
//             />
//             <span className="ml-3 text-sm">Design</span>
//           </Link>
//           <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//           <Link
//             href={
//               data?.data.sections.length > 0
//                 ? `/surveys/${data?.data._id}/survey-reponse-upload`
//                 : ""
//             }
//             className="flex items-center"
//           >
//             <BreadcrumsIcon
//               icon={
//                 data?.data.sections.length > 0 && (
//                   <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
//                 )
//               }
//               color={data?.data.sections === undefined ? "#B0A5BB" : ""}
//             />
//             <span className="ml-3 text-sm">Reponses</span>
//           </Link>
//           <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//           <Link href={""} className="flex items-center">
//             <BreadcrumsIcon color="#B0A5BB" />
//             <span className="ml-3 text-sm">Validation</span>
//           </Link>
//           <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//           <Link href={""} className="flex items-center">
//             <BreadcrumsIcon color="#B0A5BB" />
//             <span className="ml-3 text-sm">Analysis</span>
//           </Link>
//           <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//           <Link href={""} className="flex items-center">
//             <BreadcrumsIcon color="#B0A5BB" />
//             <span className="ml-3 text-sm">Report</span>
//           </Link>
//           <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
//         </nav>

//         {path.includes("survey-reponse-upload") ? (
//           <button
//             className="flex items-center justify-center gap-4 text-white text-[1rem] rounded-md px-5 py-3  bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
//             onClick={() => {
//               dispatch(openUpload());
//             }}
//           >
//             Upload Results
//           </button>
//         ) : (
//           <div className="flex justify-between items-center gap-3">
//             {path === "/surveys/create-survey" ||
//             path === "/surveys/add-question-m" ||
//             path === "/surveys/survey-list" ||
//             path.includes("validate-response") ||
//             path.includes("/surveys/question") ? (
//               " "
//             ) : (
//               <button
//                 className={`border-none flex items-center ${
//                   path === "/surveys/preview-survey" ? "invisible" : "visible"
//                 }`}
//                 onClick={() => {
//                   router.push("/surveys/preview-survey");
//                 }}
//               >
//                 <IoEyeOutline className="mr-1" /> Preview
//               </button>
//             )}
//             {!path.includes("/surveys/question") && (
//               <button className="border-none flex items-center">
//                 <IoSettingsOutline className="mr-1" />
//                 <span className="hidden xl:flex"> Survey Settings </span>
//               </button>
//             )}
//             {path.includes("/surveys/question") && (
//               <div className="relative">
//                 <button
//                   className="border-2 px-4 py-1 rounded-lg text-[#5B03B2] border-[#5B03B2] flex items-center"
//                   onClick={() => {
//                     setShareSurvey(!shareSurvey);
//                   }}
//                 >
//                   <FiShare2 className="mr-2" />
//                   <span className="hidden xl:flex"> Share </span>
//                 </button>
//                 {shareSurvey && (
//                   <div className="absolute right-0 w-[23rem] lg:w-[25rem] z-50">
//                     <ShareSurvey
//                       onClick={() => setShareSurvey((prev) => !prev)}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     )
//   );
// };

// export default SurveyCreationNav;

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
import { useDispatch } from "react-redux";
import { openUpload } from "@/redux/slices/upload.slice";
import { FiShare2 } from "react-icons/fi";
import ShareSurvey from "../survey/ShareSurvey";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSurveyResponses } from "@/services/analysis";
import { extractMongoId } from "@/lib/utils";
import { openSurveySettings } from "@/redux/slices/survey_settings.slice";

const SurveyCreationNav = () => {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const { data } = useFetchASurveyQuery(params.id);
  const [shareSurvey, setShareSurvey] = useState(false);

  // Extract surveyId regardless of path
  const surveyId = extractMongoId(path);

  // Initialize useQuery hook unconditionally
  const surveyResponses = useQuery({
    queryKey: ["get-survey-responses"],
    queryFn: () => getSurveyResponses({ surveyId: surveyId! }),
    enabled: surveyId !== undefined,
  });

  const activeLink = path.includes("survey-reponse-upload")
    ? "Reponses"
    : path.includes("preview-survey")
    ? "Preview"
    : path.includes("validation")
    ? "Validation"
    : path.includes("analysis")
    ? "Analysis"
    : "Design";

  const isExactSurveyPath = path === "/surveys";
  const isSurveySubpath = path.startsWith("/surveys") && isExactSurveyPath;

  // Conditional return after hooks
  if (isSurveySubpath) {
    return null;
  }

  return (
    !path.includes("survey-list") && (
      <div className="px-5 md:px-1 lg:px-20 py-3 border-b-2 flex justify-between items-center">
        <button
          className="border-none flex items-center"
          onClick={() => router.back()}
        >
          <IoArrowBackSharp className="mr-3" /> Back
        </button>

        {/* Small screen: Only display active link */}
        <nav className="block md:hidden">
          <Link href={""} className="flex items-center">
            <BreadcrumsIcon
              icon={
                <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
              }
            />
            <span className="ml-3 text-sm">{activeLink}</span>
          </Link>
        </nav>

        {/* Medium and Large screens: Show all links */}
        <nav className="hidden md:flex justify-between flex-wrap items-center">
          <Link href={""} className="flex items-center">
            <BreadcrumsIcon
              icon={
                <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
              }
            />
            <span className="ml-3 text-sm">Design</span>
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
            <span className="ml-3 text-sm">Reponses</span>
          </Link>
          <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
          <Link
            href={`/surveys/${params.id}/validate-response`}
            className="flex items-center"
          >
            <BreadcrumsIcon
              icon={
                surveyResponses.isSuccess &&
                surveyResponses.data?.data?.length > 0 && (
                  <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                )
              }
              color={
                surveyResponses.isSuccess &&
                surveyResponses.data?.data?.length > 0
                  ? ""
                  : "#B0A5BB"
              }
            />
            <span className="ml-3 text-sm">Validation</span>
          </Link>
          <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
          <Link
            href={`/surveys/${params.id}/analysis`}
            className="flex items-center"
          >
            <BreadcrumsIcon
              icon={
                surveyResponses.isSuccess &&
                surveyResponses.data?.data?.length > 0 && (
                  <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                )
              }
              color={
                surveyResponses.isSuccess &&
                surveyResponses.data?.data?.length > 0
                  ? ""
                  : "#B0A5BB"
              }
            />
            <span className="ml-3 text-sm">Analysis</span>
          </Link>
          <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
          <Link href={""} className="flex items-center">
            <BreadcrumsIcon color="#B0A5BB" />
            <span className="ml-3 text-sm">Report</span>
          </Link>
          {/* <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " /> */}
        </nav>

        {path.includes("survey-reponse-upload") ? (
          <button
            className="flex items-center justify-center gap-4 text-white text-[1rem] rounded-md px-5 py-3  bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
            onClick={() => {
              dispatch(openUpload());
            }}
          >
            Upload Results
          </button>
        ) : (
          <div className="flex justify-between items-center gap-3">
            {
              path === "/surveys/create-survey" ||
              path === "/surveys/add-question-m" ||
              path === "/surveys/survey-list" ||
              path.includes("validate-response") ||
              path.includes("/surveys/question")
                ? " "
                : " "
              // <button
              //   className={`border-none flex items-center ${
              //     path === "/surveys/preview-survey" ? "invisible" : "visible"
              //   }`}
              //   onClick={() => {
              //     router.push("/surveys/preview-survey");
              //   }}
              // >
              //   <IoEyeOutline className="mr-1" /> Preview
              // </button>
            }
            {!path.includes("/surveys/question") && (
              <button className="border-none flex items-center">
                <IoSettingsOutline className="mr-1" />
                <span className="hidden xl:flex"> Survey Settings </span>
              </button>
            )}
            {path.includes("/surveys/question") && (
              <div className="relative">
                <button
                  className="border-2 px-4 py-1 rounded-lg text-[#5B03B2] border-[#5B03B2] flex items-center"
                  onClick={() => {
                    setShareSurvey(!shareSurvey);
                  }}
                >
                  <FiShare2 className="mr-2" />
                  <span className="hidden xl:flex"> Share </span>
                </button>
                {shareSurvey && (
                  <div className="absolute right-0 w-[23rem] lg:w-[25rem] z-50">
                    <ShareSurvey
                      onClick={() => setShareSurvey((prev) => !prev)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
};

export default SurveyCreationNav;
