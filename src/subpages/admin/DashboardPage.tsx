"use client";

import "./style.css";
import Navbar from "../../components/navbar/Navbar";
import trophy from "../../assets/images/trophy.svg";
import LineChart from "../../components/charts/LineChart";
import {
  useDataCollectorCountQuery,
  useFormResponseRateQuery,
  useSurveyLeaderboardQuery,
  useSurveyQuery,
  useSurveysCountQuery,
} from "../../services/dashboard.service";
import SurveyTable from "../../components/ui/SurveyTable";
import NoSurvey from "../../components/ui/NoSurvey";
import Image from "next/image";
import TopResponse from "@/components/ui/TopResponse";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocketIOTester from "@/contexts/SocketIOTester";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DashboardPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const { data: item, isLoading: isItemLoading } =
    useFormResponseRateQuery("year");
  const { data: collectedDataCount, isLoading: isCollectedDataLoading } =
    useDataCollectorCountQuery("year");
  const { data: surveyCount, isLoading: isSurveyCountLoading } =
    useSurveysCountQuery("year");
  const { data: surveyLeaderboard, isLoading: isSurveyLeaderboardLoading } =
    useSurveyLeaderboardQuery("year");
  const { data: surveys, isLoading: isSurveysLoading } = useSurveyQuery("year");

  function DashboardSkeleton() {
    return (
      <div className="p-4 md:p-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 md:h-8 w-36 md:w-48" />
            </div>
            <Skeleton className="h-4 md:h-6 w-28 md:w-36" />
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex items-center p-2 md:p-4 gap-2 md:gap-4">
                <Skeleton className="size-16 md:size-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 md:h-4 w-12 md:w-16" />
                  <Skeleton className="h-3 md:h-4 w-16 md:w-20" />
                </div>
              </CardContent>
            </Card>
            <Separator
              orientation="vertical"
              className="hidden md:block h-6 bg-[#00000030]"
            />
            <Skeleton className="h-10 w-full md:w-36 rounded-full" />
            <Skeleton className="size-10 rounded-full hidden md:block" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index}>
              <CardContent className="p-4 md:p-6">
                <Skeleton className="h-3 md:h-4 w-20 md:w-24 mb-2" />
                <Skeleton className="h-6 md:h-8 w-12 md:w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function SurveyDashboardHeader({ isLoading }: { isLoading: boolean }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDate = (date: Date) => {
      return {
        day: date.getDate(),
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
        month: date.toLocaleDateString("en-US", { month: "long" }),
      };
    };

    const { day, weekday, month } = formatDate(currentDate);

    const metrics = [
      { title: "Total Coins", value: 0 },
      {
        title: "Total no of. Surveys",
        value: surveyCount?.data?.total ?? "--",
      },
      {
        title: "Completed Surveys",
        value: surveyCount?.data?.completed ?? "--",
      },
      { title: "Ongoing Surveys", value: surveyCount?.data?.ongoing ?? "--" },
    ];

    if (isLoading) {
      return <DashboardSkeleton />;
    }

    return (
      <div className="p-2 md:p-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-3xl font-bold">
                Hey, {user?.name.split(" ")[0]} 👋
              </h1>
            </div>
            <p className="text-lg md:text-2xl text-gray-400">
              Great to have you here!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex items-center p-2 md:p-4 gap-2 md:gap-4">
                <div className="text-2xl md:text-4xl font-semibold border border-[#00000030] rounded-full size-16 md:size-20 flex justify-center items-center">
                  {day}
                </div>
                <div className="text-xs md:text-sm">
                  <div>{weekday},</div>
                  <div>{month}</div>
                </div>
              </CardContent>
            </Card>
            <Separator
              orientation="vertical"
              className="hidden md:block h-6 bg-[#00000030]"
            />
            <Button
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-full text-sm md:text-base"
              onClick={() => router.push("/surveys/survey-list")}
            >
              Show My Surveys
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="relative rounded-full hidden md:flex"
              onClick={() => router.push("/calendar")}
            >
              <Calendar className="w-4 h-4" />
              <span className="absolute top-1 right-1 size-1 bg-[#5B03B2] rounded-full" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4 md:p-6">
                <h3 className="text-gray-500 mb-2 text-sm md:text-base">
                  {metric.title}
                </h3>
                <p className="text-xl md:text-2xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-2 md:px-4">
        <SurveyDashboardHeader isLoading={isSurveyCountLoading} />
        <div className="dashboard-content flex flex-col justify-center gap-4 md:gap-6 w-full pb-5">
          <div className="flex w-full mt-4 md:mt-6 gap-4 flex-col lg:flex-row">
            <div className="chart w-full flex justify-center px-2 sm:px-2">
              <LineChart />
            </div>
            <div className="stat w-full lg:max-w-[305px] flex flex-col gap-4 px-2">
              <div className="stat w-full lg:max-w-[305px] h-auto bg-white rounded-lg shadow-sm border-border border">
                <div className="h-[68px] top-response-rate w-full flex items-center">
                  <div className="flex justify-between items-center w-full px-4">
                    <div className="flex flex-col gap-1">
                      <p className="top-response-title text-[10px] md:text-xs">
                        TOP RESPONSE RATE
                      </p>
                      <p className="top-response-text text-xs md:text-sm">
                        PollSensei Leaderboard
                      </p>
                    </div>
                    <Image
                      src={trophy}
                      alt="Trophy"
                      width={24}
                      height={24}
                      className="size-5 md:size-6"
                    />
                  </div>
                </div>

                <div className="p-3 md:p-4 w-full flex flex-col gap-3 md:gap-4 ">
                  {isSurveyLeaderboardLoading && (
                    <>
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div
                          key={index}
                          className="flex w-full items-center justify-between animate-pulse"
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="size-5 md:size-6 bg-gray-200 rounded-full flex justify-center items-center"></div>
                            <div className="flex flex-col gap-1">
                              <div className="h-3 md:h-4 bg-gray-200 rounded w-24 md:w-32"></div>
                              <div className="h-2 md:h-3 bg-gray-200 rounded w-20 md:w-24"></div>
                            </div>
                          </div>
                          <div className="size-5 md:size-6 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </>
                  )}
                  {!isSurveyLeaderboardLoading &&
                    surveyLeaderboard?.data?.length > 0 &&
                    surveyLeaderboard?.data?.map((row: any, index: number) => (
                      <TopResponse
                        key={index}
                        id={index + 1}
                        title={row?.topic.slice(0, 20)}
                        value={row?.number_of_responses}
                        link={`/surveys/question/${row?._id}`}
                      />
                    ))}
                  {!isSurveyLeaderboardLoading &&
                    !Boolean(surveyLeaderboard?.data?.length) && (
                      <div className="flex justify-center text-center items-center text-xs md:text-sm h-[15rem] text-[#7A8699]">
                        No survey has been created yet. Check back soon.
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-4 flex-col lg:flex-row px-2">
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <p className="survey-head text-base md:text-lg font-semibold">
                    Surveys
                  </p>
                  <button className="survey-view-btn text-xs md:text-sm">
                    <Link href={"/surveys/survey-list"}>View all</Link>
                  </button>
                </div>
              </div>
              <div className="radius h-fit shadow-sm border border-border !rounded-lg overflow-x-auto">
                {surveys?.data?.length > 0 ? (
                  <SurveyTable />
                ) : (
                  <NoSurvey
                    onCreateSurvey={() => router.push("/surveys/create-survey")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
