"use client";

import {
  IoArrowBackSharp,
  IoCheckmarkDoneCircle,
  IoSettingsOutline,
  IoEyeOutline,
  IoWarningOutline,
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
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSurveyResponses } from "@/services/analysis";
import { extractMongoId } from "@/lib/utils";
import { openSurveySettings } from "@/redux/slices/survey_settings.slice";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const SurveyCreationNav = () => {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const { data } = useFetchASurveyQuery(params.id);
  const [shareSurvey, setShareSurvey] = useState(false);
  const queryClient = useQueryClient();
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );

  // Extract surveyId regardless of path
  const surveyId = extractMongoId(path);

  // Initialize useQuery hook unconditionally
  const surveyResponses = useQuery({
    queryKey: [`get-survey-responses-${surveyId}`],
    queryFn: () => getSurveyResponses({ surveyId: surveyId! }),
    enabled: surveyId !== undefined,
  });

  // Force refetch on mount
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["get-survey-responses"] });
  }, [queryClient]);

  const activeLink = path.includes("survey-response-upload")
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
        {userRoles.includes("Admin") && (
          <>
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
                    ? `/surveys/${data?.data._id}/survey-response-upload`
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
                <span className="ml-3 text-sm">Responses</span>
              </Link>
              <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
              <Link
                href={
                  path.includes(
                    "survey-response-upload?tab=Individual+Responses"
                  )
                    ? `/surveys/${data?.data._id}/survey-response-upload?tab=Individual+Responses`
                    : ""
                }
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
              {surveyResponses.data?.data?.length >= 10 ? (
                <button
                  className="flex items-center group relative"
                  onClick={() => {
                    if (surveyResponses.data?.data?.length >= 10) {
                      router.push(`/surveys/${params.id}/analysis`);
                    }
                  }}
                >
                  <BreadcrumsIcon
                    icon={
                      surveyResponses.isSuccess ? (
                        surveyResponses.data?.data?.length >= 10 ? (
                          <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                        ) : (
                          <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                            <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                          </div>
                        )
                      ) : null
                    }
                    color={
                      surveyResponses.isSuccess &&
                      surveyResponses.data?.data?.length >= 10
                        ? ""
                        : "#B0A5BB"
                    }
                  />
                  <span className="ml-3 text-sm">Analysis</span>
                  {surveyResponses.isSuccess &&
                    surveyResponses.data?.data?.length < 10 && (
                      <div className="absolute z-[10000] shadow-md border border-border invisible group-hover:visible bg-white text-black text-xs rounded py-1 px-2 -top-8 whitespace-nowrap">
                        {10 - (surveyResponses.data?.data?.length || 0)} more
                        responses needed to unlock analysis
                      </div>
                    )}
                </button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center group relative"
                      onClick={() => {
                        if (surveyResponses.data?.data?.length >= 10) {
                          router.push(`/surveys/${params.id}/analysis`);
                        }
                      }}
                    >
                      <BreadcrumsIcon
                        icon={
                          surveyResponses.isSuccess ? (
                            surveyResponses.data?.data?.length >= 10 ? (
                              <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                            ) : (
                              <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                                <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                              </div>
                            )
                          ) : null
                        }
                        color={
                          surveyResponses.isSuccess &&
                          surveyResponses.data?.data?.length >= 10
                            ? ""
                            : "#B0A5BB"
                        }
                      />
                      <span className="ml-3 text-sm">Analysis</span>
                      {surveyResponses.isSuccess &&
                        surveyResponses.data?.data?.length < 10 && (
                          <div className="absolute z-[10000] shadow-md border border-border invisible group-hover:visible bg-white text-black text-xs rounded py-1 px-2 -top-8 whitespace-nowrap">
                            {10 - (surveyResponses.data?.data?.length || 0)}{" "}
                            more responses needed to unlock analysis
                          </div>
                        )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Insufficient Responses</DialogTitle>
                      <DialogDescription>
                        You need at least 10 survey responses to access the
                        analysis section. This ensures more meaningful and
                        statistically relevant insights from your data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      <Image
                        src="/assets/analysis/no-data.svg"
                        alt="Analysis Locked"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Current responses:{" "}
                        {surveyResponses.data?.data?.length || 0}
                        /10
                      </p>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
              <Link href={""} className="flex items-center">
                <BreadcrumsIcon color="#B0A5BB" />
                <span className="ml-3 text-sm">Report</span>
              </Link>
              {/* <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " /> */}
            </nav>
          </>
        )}

        <nav className="flex justify-between flex-wrap items-center">
          {userRoles.includes("Data Collector") && (
            <>
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
                    ? `/surveys/${data?.data._id}/survey-response-upload`
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
                <span className="ml-3 text-sm">Responses</span>
              </Link>
            </>
          )}
          {userRoles.includes("Data Validator") && (
            <>
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
                    ? `/surveys/${data?.data._id}/survey-response-upload`
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
                <span className="ml-3 text-sm">Responses</span>
              </Link>
              <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
              <Link
                href={
                  path.includes(
                    "survey-response-upload?tab=Individual+Responses"
                  )
                    ? `/surveys/${data?.data._id}/survey-response-upload?tab=Individual+Responses`
                    : ""
                }
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
            </>
          )}
          {userRoles.includes("Data Editor") && (
            <>
              <Link href={""} className="flex items-center">
                <BreadcrumsIcon
                  icon={
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                  }
                />
                <span className="ml-3 text-sm">Design</span>
              </Link>
            </>
          )}
          {userRoles.includes("Data Analyst") && (
            <>
              <Link href={""} className="flex items-center">
                <BreadcrumsIcon
                  icon={
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                  }
                />
                <span className="ml-3 text-sm">Design</span>
              </Link>
              <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
              {surveyResponses.data?.data?.length >= 10 ? (
                <button
                  className="flex items-center group relative"
                  onClick={() => {
                    if (surveyResponses.data?.data?.length >= 10) {
                      router.push(`/surveys/${params.id}/analysis`);
                    }
                  }}
                >
                  <BreadcrumsIcon
                    icon={
                      surveyResponses.isSuccess ? (
                        surveyResponses.data?.data?.length >= 10 ? (
                          <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                        ) : (
                          <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                            <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                          </div>
                        )
                      ) : null
                    }
                    color={
                      surveyResponses.isSuccess &&
                      surveyResponses.data?.data?.length >= 10
                        ? ""
                        : "#B0A5BB"
                    }
                  />
                  <span className="ml-3 text-sm">Analysis</span>
                  {surveyResponses.isSuccess &&
                    surveyResponses.data?.data?.length < 10 && (
                      <div className="absolute z-[10000] shadow-md border border-border invisible group-hover:visible bg-white text-black text-xs rounded py-1 px-2 -top-8 whitespace-nowrap">
                        {10 - (surveyResponses.data?.data?.length || 0)} more
                        responses needed to unlock analysis
                      </div>
                    )}
                </button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center group relative"
                      onClick={() => {
                        if (surveyResponses.data?.data?.length >= 10) {
                          router.push(`/surveys/${params.id}/analysis`);
                        }
                      }}
                    >
                      <BreadcrumsIcon
                        icon={
                          surveyResponses.isSuccess ? (
                            surveyResponses.data?.data?.length >= 10 ? (
                              <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                            ) : (
                              <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                                <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                              </div>
                            )
                          ) : null
                        }
                        color={
                          surveyResponses.isSuccess &&
                          surveyResponses.data?.data?.length >= 10
                            ? ""
                            : "#B0A5BB"
                        }
                      />
                      <span className="ml-3 text-sm">Analysis</span>
                      {surveyResponses.isSuccess &&
                        surveyResponses.data?.data?.length < 10 && (
                          <div className="absolute z-[10000] shadow-md border border-border invisible group-hover:visible bg-white text-black text-xs rounded py-1 px-2 -top-8 whitespace-nowrap">
                            {10 - (surveyResponses.data?.data?.length || 0)}{" "}
                            more responses needed to unlock analysis
                          </div>
                        )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Insufficient Responses</DialogTitle>
                      <DialogDescription>
                        You need at least 10 survey responses to access the
                        analysis section. This ensures more meaningful and
                        statistically relevant insights from your data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      <Image
                        src="/assets/analysis/no-data.svg"
                        alt="Analysis Locked"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Current responses:{" "}
                        {surveyResponses.data?.data?.length || 0}
                        /10
                      </p>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Image src={hypen} alt="hypen" className="mx-3 hidden md:flex " />
              <Link href={""} className="flex items-center">
                <BreadcrumsIcon color="#B0A5BB" />
                <span className="ml-3 text-sm">Report</span>
              </Link>
            </>
          )}
        </nav>

        {path.includes("survey-response-upload") ? (
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
            {path === "/surveys/create-survey" ||
            path === "/surveys/add-question-m" ||
            path === "/surveys/survey-list" ||
            path.includes("validate-response") ||
            path.includes("/surveys/question")
              ? " "
              : " "}
            {path.includes("/surveys/question") && (
              <div className="relative">
                {userRoles.includes("Admin") && (
                  <button
                    className="border-2 px-4 py-1 rounded-lg text-[#5B03B2] border-[#5B03B2] flex items-center"
                    onClick={() => {
                      setShareSurvey(!shareSurvey);
                    }}
                  >
                    <FiShare2 className="mr-2" />
                    <span className="hidden xl:flex"> Share </span>
                  </button>
                )}
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
