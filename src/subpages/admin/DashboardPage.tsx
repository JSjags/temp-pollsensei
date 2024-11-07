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

const DashboardPage = () => {
  const router = useRouter();
  const { data: item } = useFormResponseRateQuery("year");
  const { data: collectedDataCount } = useDataCollectorCountQuery("year");
  const { data: surveyCount } = useSurveysCountQuery("year");
  const { data: surveyLeaderboard } = useSurveyLeaderboardQuery("year");
  const { data: surveys } = useSurveyQuery("year");

  console.log(item);
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="dashboard-content flex flex-col justify-center gap-6 w-full pb-5">
          <div className="flex w-full mt-6 gap-4 flex-col lg:flex-row">
            <div className="chart w-full h-[300px] sm:h-[321px] radius flex justify-center">
              <LineChart data={item?.data.data} xKey="date" yKey="response_count" />
            </div>
            <div className="stat w-full lg:max-w-[305px] flex flex-col gap-4">
              <div className="radius w-full h-auto sm:h-[211px] p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 flex-col items-start justify-start">
                    <p className="no-data-connectors text-sm">
                      Total no of surveys generated
                    </p>
                    <p className="no-data-connectors-value text-xl font-bold">
                      {surveyCount?.data.total}
                    </p>
                  </div>

                  <div className="divider border border-[#DFE2E6] h-[1px] w-auto"></div>

                  <div className="flex flex-col gap-3">
                    <div className="flex w-full gap-2 items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <span className="status-completed w-3 h-3 rounded-full"></span>
                        <p className="survey-status text-sm">Completed</p>
                      </div>
                      <p className="survey-total text-sm font-semibold">
                        {surveyCount?.data.completed}
                      </p>
                    </div>

                    <div className="flex w-full gap-2 items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <span className="status-ongoing w-3 h-3 rounded-full"></span>
                        <p className="survey-status text-sm">Ongoing</p>
                      </div>
                      <p className="survey-total text-sm font-semibold">
                        {surveyCount?.data.ongoing}
                      </p>
                    </div>

                    <div className="flex w-full gap-2 items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <span className="status-cancelled w-3 h-3 rounded-full"></span>
                        <p className="survey-status text-sm">Cancelled</p>
                      </div>
                      <p className="survey-total text-sm font-semibold">
                        {surveyCount?.data.cancelled}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="radius w-full h-[98px] flex items-center justify-start p-4">
                <div className="flex gap-2 flex-col items-start justify-start">
                  <p className="no-data-connectors text-sm">
                    Total no of Data Collectors
                  </p>
                  <p className="no-data-connectors-value text-xl font-bold">
                    {collectedDataCount?.data?.total_number_of_data_collectors}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <SocketIOTester /> */}

          <div className="flex w-full gap-4 flex-col lg:flex-row">
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <p className="survey-head text-lg font-semibold">Surveys</p>
                  <button className="survey-view-btn w-auto text-sm">
                    <Link href={"/surveys/created-surveys"}>View all</Link>
                  </button>
                </div>
              </div>
              <div className="radius h-[386px] shadow-md sm:rounded-lg overflow-x-auto">
                {surveys?.data?.length > 0 ? (
                  <SurveyTable />
                ) : (
                  <NoSurvey onCreateSurvey={() => router.push("/surveys")} />
                )}
              </div>
            </div>

            <div className="stat w-full lg:max-w-[305px] h-auto sm:h-[386px] radius">
              <div className="h-[68px] top-response-rate w-full flex items-center">
                <div className="flex justify-between items-center w-full px-4">
                  <div className="flex flex-col gap-1">
                    <p className="top-response-title text-xs">
                      TOP RESPONSE RATE
                    </p>
                    <p className="top-response-text text-sm">
                      Poll Sensei Leaderboard
                    </p>
                  </div>
                  <Image src={trophy} alt="Trophy" width={24} height={24} />
                </div>
              </div>

              <div className="p-4 w-full flex flex-col gap-4">
                {surveyLeaderboard?.data.length > 0 ? (
                  surveyLeaderboard?.data?.map((row: any, index: number) => (
                    <TopResponse
                      key={index}
                      id={index + 1}
                      title={row?.topic.slice(0, 20)}
                      value={row?.number_of_responses}
                    />
                  ))
                ) : (
                  <div className="flex justify-center text-center items-center text-sm h-[15rem] text-[#7A8699]">
                    No survey has been created yet. Check back soon.
                  </div>
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
