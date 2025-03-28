"use client";

import {
  IoArrowBackSharp,
  IoCheckmarkDoneCircle,
  IoSettingsOutline,
  IoEyeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import Link from "next/link";
import BreadcrumbsIcon from "../ui/BreadcrumsIcon";
import Image from "next/image";
import { hyphen } from "@/assets/images";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useFetchASurveyQuery } from "@/services/survey.service";
import { useDispatch } from "react-redux";
import { openUpload } from "@/redux/slices/upload.slice";
import { FiShare2, FiUpload } from "react-icons/fi";
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
import { Skeleton } from "../ui/skeleton";

const SurveyCreationNav = () => {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const [shareSurvey, setShareSurvey] = useState(false);
  const queryClient = useQueryClient();
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );
  const {
    data,
    isLoading: surveyLoading,
    isFetching: surveyFetching,
  } = useFetchASurveyQuery(params.id, {
    skip: !params.id || path.includes("edit-draft-survey"),
  });

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

  // Move state updates to useEffect
  useEffect(() => {
    if (
      path === "/surveys/create-survey" ||
      path === "/surveys/add-question-m" ||
      path === "/surveys/survey-list" ||
      path.includes("validate-response") ||
      path.includes("validate-res") ||
      path.includes("/surveys/question")
    ) {
      // Handle path-based logic here
    }
  }, [path]);

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

  // Add this helper function to check loading states
  const isLoading = (queryLoading?: boolean, queryFetching?: boolean) => {
    return (
      queryLoading ||
      queryFetching ||
      surveyResponses.isLoading ||
      surveyResponses.isFetching
    );
  };

  // Update the NavItemSkeleton component to be more visually appealing
  const NavItemSkeleton = () => (
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );

  // Update renderNavItem to use the new isLoading helper
  const renderNavItem = (
    icon: React.ReactNode,
    label: string,
    queryLoading?: boolean,
    queryFetching?: boolean
  ) => {
    if (isLoading(queryLoading, queryFetching)) {
      return <NavItemSkeleton />;
    }

    return (
      <>
        <BreadcrumbsIcon icon={icon} />
        <span className="md:mt-1 lg:mt-0 lg:ml-3 text-xs md:text-xs min-[1150px]:text-sm">
          {label}
        </span>
      </>
    );
  };

  // Conditional return after hooks
  if (isSurveySubpath) {
    return null;
  }

  return (
    !path.includes("survey-list") && (
      <>
        {/* desktop */}
        <div className="hidden md:flex px-5 py-3 border-b border-border justify-between items-center relative">
          <button
            className="absolute left-5 top-1/2 -translate-y-1/2 border-none flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-gray-100 group"
            onClick={() => router.back()}
          >
            <IoArrowBackSharp className="size-4 min-[1150px]:size-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-gray-600 hidden sm:inline font-medium md:hidden lg:inline text-sm md:text-xs min-[1150px]:text-sm">
              Back
            </span>
          </button>

          {/* Small screen: Only display active link */}
          {userRoles.includes("Admin") && (
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex justify-between flex-wrap items-center w-fit">
                <Link
                  href={""}
                  className="flex md:flex-col lg:flex-row items-center"
                >
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data.sections.length > 0
                      ? `/surveys/${data?.data._id}/survey-response-upload`
                      : ""
                  }
                  className="flex md:flex-col lg:flex-row items-center"
                >
                  {renderNavItem(
                    data?.data.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Responses",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                {/* Validation link commented out */}
                {/* <Link
                  href={
                    path.includes(
                      "survey-response-upload?tab=Individual+Responses"
                    )
                      ? `/surveys/${data?.data._id}/survey-response-upload?tab=Individual+Responses`
                      : ""
                  }
                  className="flex md:flex-col lg:flex-row items-center"
                >
                  {renderNavItem(
                    surveyResponses.isSuccess &&
                      surveyResponses.data?.data?.length > 0 && (
                        <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                      ),
                    "Validation",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link> */}
                {/* <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                /> */}
                {surveyResponses.data?.data?.length >= 10 ? (
                  <button
                    className="flex md:flex-col lg:flex-row items-center group relative"
                    onClick={() => {
                      if (surveyResponses.data?.data?.length >= 10) {
                        router.push(`/surveys/${params.id}/analysis`);
                      }
                    }}
                  >
                    {renderNavItem(
                      surveyResponses.isSuccess ? (
                        surveyResponses.data?.data?.length >= 10 ? (
                          <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                        ) : (
                          <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                            <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                          </div>
                        )
                      ) : null,
                      "Analysis",
                      surveyLoading,
                      surveyFetching
                    )}
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
                        className="flex md:flex-col lg:flex-row items-center group relative"
                        onClick={() => {
                          if (surveyResponses.data?.data?.length >= 10) {
                            router.push(`/surveys/${params.id}/analysis`);
                          }
                        }}
                      >
                        {renderNavItem(
                          surveyResponses.isSuccess ? (
                            surveyResponses.data?.data?.length >= 10 ? (
                              <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                            ) : (
                              <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                                <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                              </div>
                            )
                          ) : null,
                          "Analysis",
                          surveyLoading,
                          surveyFetching
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-[425px] z-[100000]"
                      overlayClassName="z-[100000]"
                    >
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
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data?._id ? `/surveys/${data?.data?._id}/report` : ""
                  }
                  className="flex md:flex-col lg:flex-row items-center"
                >
                  {renderNavItem(
                    data?.data?.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Report",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </nav>
            </div>
          )}

          <nav className="flex justify-between flex-wrap items-center">
            {userRoles.includes("Data Collector") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data.sections.length > 0
                      ? `/surveys/${data?.data._id}/survey-response-upload`
                      : ""
                  }
                  className="flex items-center"
                >
                  {renderNavItem(
                    data?.data.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Responses",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </>
            )}
            {userRoles.includes("Data Validator") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data.sections.length > 0
                      ? `/surveys/${data?.data._id}/survey-response-upload`
                      : ""
                  }
                  className="flex items-center"
                >
                  {renderNavItem(
                    data?.data.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Responses",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                {/* <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                /> */}
                {/* Validation link commented out */}
                {/* <Link
                  href={
                    path.includes(
                      "survey-response-upload?tab=Individual+Responses"
                    )
                      ? `/surveys/${data?.data._id}/survey-response-upload?tab=Individual+Responses`
                      : ""
                  }
                  className="flex items-center"
                >
                  {renderNavItem(
                    surveyResponses.isSuccess &&
                      surveyResponses.data?.data?.length > 0 && (
                        <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                      ),
                    "Validation",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link> */}
              </>
            )}
            {userRoles.includes("Data Editor") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </>
            )}
            {userRoles.includes("Data Analyst") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                {surveyResponses.data?.data?.length >= 10 ? (
                  <button
                    className="flex items-center group relative"
                    onClick={() => {
                      if (surveyResponses.data?.data?.length >= 10) {
                        router.push(`/surveys/${params.id}/analysis`);
                      }
                    }}
                  >
                    {renderNavItem(
                      surveyResponses.isSuccess ? (
                        surveyResponses.data?.data?.length >= 10 ? (
                          <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                        ) : (
                          <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                            <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                          </div>
                        )
                      ) : null,
                      "Analysis",
                      surveyLoading,
                      surveyFetching
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
                        {renderNavItem(
                          surveyResponses.isSuccess ? (
                            surveyResponses.data?.data?.length >= 10 ? (
                              <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                            ) : (
                              <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                                <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                              </div>
                            )
                          ) : null,
                          "Analysis",
                          surveyLoading,
                          surveyFetching
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-[425px] z-[100000]"
                      overlayClassName="z-[100000]"
                    >
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
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data?._id ? `/surveys/${data?.data?._id}/report` : ""
                  }
                  className="flex md:flex-col lg:flex-row items-center"
                >
                  {renderNavItem(
                    data?.data?.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Report",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </>
            )}
          </nav>

          {path.includes("survey-response-upload") ? (
            <Button
              className="flex items-center justify-center gap-3 text-white text-[1rem] text-sm rounded-xl px-5 py-3  bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
              onClick={() => {
                dispatch(openUpload());
              }}
            >
              <FiUpload className="w-5 h-5" />
              Upload Results
            </Button>
          ) : (
            <div className="flex justify-between items-center gap-3">
              {path === "/surveys/create-survey" ||
              path === "/surveys/add-question-m" ||
              path === "/surveys/survey-list" ||
              path.includes("validate-response") ||
              path.includes("validate-res") ||
              path.includes("/surveys/question")
                ? " "
                : " "}
              {path.includes("/surveys/question") && (
                <div className="relative">
                  {userRoles.includes("Admin") && (
                    <button
                      className="border-2 px-4 py-1 rounded-lg text-[#5B03B2] border-[#5B03B2] flex items-center transition-all duration-300 hover:bg-[#5B03B2] hover:text-white hover:scale-105"
                      onClick={() => setShareSurvey((prev) => !prev)}
                    >
                      <FiShare2 className="mr-2" />
                      <span className="hidden xl:flex"> Share </span>
                    </button>
                  )}
                  <Dialog open={shareSurvey} onOpenChange={setShareSurvey}>
                    <DialogContent
                      className="w-[23rem] lg:w-[25rem] z-[100000]"
                      overlayClassName="z-[100000]"
                    >
                      <ShareSurvey onClick={() => setShareSurvey(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </div>

        {/* mobile */}
        <div className="flex md:hidden px-2 py-5 bg-white justify-between items-center relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 border-none flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-gray-100 group"
            onClick={() => router.back()}
          >
            <IoArrowBackSharp className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-gray-600 hidden sm:inline font-medium">
              Back
            </span>
          </button>

          {/* Small screen: Only display active link */}
          {userRoles.includes("Admin") && (
            <div className="flex-1 fixed bottom-0 left-0 right-0 bg-white border-t border-border z-[10]">
              <nav className="flex justify-between items-center px-6 py-3">
                <Link
                  href={""}
                  className="flex flex-col items-center group hover:scale-110 transition-transform duration-200"
                >
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3 group-hover:scale-110 transition-transform duration-200" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>

                <Link
                  href={
                    data?.data.sections.length > 0
                      ? `/surveys/${data?.data._id}/survey-response-upload`
                      : ""
                  }
                  className="flex flex-col items-center group hover:scale-110 transition-transform duration-200"
                >
                  {renderNavItem(
                    data?.data.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                    ),
                    "Responses",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>

                {/* Validation link commented out */}
                {/* <Link
                  href={
                    path.includes(
                      "survey-response-upload?tab=Individual+Responses"
                    )
                      ? `/surveys/${data?.data._id}/survey-response-upload?tab=Individual+Responses`
                      : ""
                  }
                  className="flex flex-col items-center group hover:scale-110 transition-transform duration-200"
                >
                  {renderNavItem(
                    surveyResponses.isSuccess &&
                      surveyResponses.data?.data?.length > 0 && (
                        <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                      ),
                    "Validation",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link> */}

                {surveyResponses.data?.data?.length >= 10 ? (
                  <button
                    className="flex flex-col items-center group hover:scale-110 transition-transform duration-200"
                    onClick={() => {
                      if (surveyResponses.data?.data?.length >= 10) {
                        router.push(`/surveys/${params.id}/analysis`);
                      }
                    }}
                  >
                    {renderNavItem(
                      surveyResponses.isSuccess ? (
                        surveyResponses.data?.data?.length >= 10 ? (
                          <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                        ) : (
                          <div className="bg-amber-100 rounded-full flex justify-center items-center size-3 group-hover:scale-110 transition-transform duration-200">
                            <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                          </div>
                        )
                      ) : null,
                      "Analysis",
                      surveyLoading,
                      surveyFetching
                    )}
                  </button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex flex-col items-center group hover:scale-110 transition-transform duration-200">
                        {renderNavItem(
                          surveyResponses.isSuccess ? (
                            surveyResponses.data?.data?.length >= 10 ? (
                              <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                            ) : (
                              <div className="bg-amber-100 rounded-full flex justify-center items-center size-3 group-hover:scale-110 transition-transform duration-200">
                                <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                              </div>
                            )
                          ) : null,
                          "Analysis",
                          surveyLoading,
                          surveyFetching
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      className="w-[90%] rounded-lg sm:max-w-[280px] z-[100000]"
                      overlayClassName="z-[100000]"
                    >
                      <DialogHeader>
                        <DialogTitle>Insufficient Responses</DialogTitle>
                        <DialogDescription className="text-sm mt-2">
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

                <Link
                  href={
                    data?.data?._id ? `/surveys/${data?.data?._id}/report` : ""
                  }
                  className="flex flex-col items-center group hover:scale-110 transition-transform duration-200"
                >
                  {renderNavItem(
                    data?.data?.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Report",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </nav>
            </div>
          )}

          <nav className="flex justify-between flex-wrap items-center">
            {userRoles.includes("Data Collector") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data.sections.length > 0
                      ? `/surveys/${data?.data._id}/survey-response-upload`
                      : ""
                  }
                  className="flex items-center"
                >
                  {renderNavItem(
                    data?.data.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Responses",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </>
            )}
            {userRoles.includes("Data Validator") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data.sections.length > 0
                      ? `/surveys/${data?.data._id}/survey-response-upload`
                      : ""
                  }
                  className="flex items-center"
                >
                  {renderNavItem(
                    data?.data.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Responses",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
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
                  {renderNavItem(
                    surveyResponses.isSuccess &&
                      surveyResponses.data?.data?.length > 0 && (
                        <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                      ),
                    "Validation",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </>
            )}
            {userRoles.includes("Data Editor") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </>
            )}
            {userRoles.includes("Data Analyst") && (
              <>
                <Link href={""} className="flex items-center">
                  {renderNavItem(
                    <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />,
                    "Design",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                {surveyResponses.data?.data?.length >= 10 ? (
                  <button
                    className="flex items-center group relative"
                    onClick={() => {
                      if (surveyResponses.data?.data?.length >= 10) {
                        router.push(`/surveys/${params.id}/analysis`);
                      }
                    }}
                  >
                    {renderNavItem(
                      surveyResponses.isSuccess ? (
                        surveyResponses.data?.data?.length >= 10 ? (
                          <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                        ) : (
                          <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                            <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                          </div>
                        )
                      ) : null,
                      "Analysis",
                      surveyLoading,
                      surveyFetching
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
                        {renderNavItem(
                          surveyResponses.isSuccess ? (
                            surveyResponses.data?.data?.length >= 10 ? (
                              <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                            ) : (
                              <div className="bg-amber-100 rounded-full flex justify-center items-center size-3">
                                <IoWarningOutline className="text-amber-500 flex justify-center w-2 h-2" />
                              </div>
                            )
                          ) : null,
                          "Analysis",
                          surveyLoading,
                          surveyFetching
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-[425px] z-[100000]"
                      overlayClassName="z-[100000]"
                    >
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
                <Image
                  src={hyphen}
                  alt="hyphen"
                  className="mx-3 md:mx-2 min-[1150px]:mx-3 hidden md:flex md:w-4 lg:w-auto"
                />
                <Link
                  href={
                    data?.data?._id ? `/surveys/${data?.data?._id}/report` : ""
                  }
                  className="flex md:flex-col lg:flex-row items-center"
                >
                  {renderNavItem(
                    data?.data?.sections.length > 0 && (
                      <IoCheckmarkDoneCircle className="text-[#5B03B2] flex justify-center w-3 h-3" />
                    ),
                    "Report",
                    surveyLoading,
                    surveyFetching
                  )}
                </Link>
              </>
            )}
          </nav>

          {path.includes("survey-response-upload") ? (
            <Button
              className="flex items-center justify-center gap-3 text-white text-[1rem] text-sm rounded-xl px-5 py-3  bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
              onClick={() => {
                dispatch(openUpload());
              }}
            >
              <FiUpload className="w-5 h-5" />
              Upload Results
            </Button>
          ) : (
            <div className="flex justify-between items-center gap-3">
              {path === "/surveys/create-survey" ||
              path === "/surveys/add-question-m" ||
              path === "/surveys/survey-list" ||
              path.includes("validate-response") ||
              path.includes("validate-res") ||
              path.includes("/surveys/question")
                ? " "
                : " "}
              {path.includes("/surveys/question") && (
                <div className="relative">
                  {userRoles.includes("Admin") && (
                    <button
                      className="border-2 px-4 py-1 rounded-lg text-[#5B03B2] border-[#5B03B2] flex items-center transition-all duration-300 hover:bg-[#5B03B2] hover:text-white hover:scale-105"
                      onClick={() => setShareSurvey((prev) => !prev)}
                    >
                      <FiShare2 className="mr-2" />
                      <span className="hidden xl:flex"> Share </span>
                    </button>
                  )}
                  <Dialog open={shareSurvey} onOpenChange={setShareSurvey}>
                    <DialogContent
                      className="w-[23rem] lg:w-[25rem] z-[100000]"
                      overlayClassName="z-[100000]"
                    >
                      <ShareSurvey onClick={() => setShareSurvey(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    )
  );
};

export default SurveyCreationNav;
