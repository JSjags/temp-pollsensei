"use client";

import React, { useState } from "react";
import { getLatestSurveyMilestone } from "@/services/analysis";
import SurveysPage from "@/subpages/admin/SurveysPage";
import { useQuery } from "@tanstack/react-query";
import { Button as ShadButton } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "@/components/primitives/Loader";
import Milestones from "@/components/survey/Milestones";
import SurveyWelcomeAlertDialog from "@/components/survey/SurveyWelcomeAlertDialog";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();

  const latestMilestone = useQuery({
    queryKey: ["latest-milestone"],
    queryFn: () => getLatestSurveyMilestone(),
  });

  const [showModal, setShowModal] = useState(true);

  console.log(latestMilestone.isError);
  console.log(latestMilestone);

  return (
    <>
      {latestMilestone.isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <Loading />
        </div>
      )}
      {latestMilestone.isSuccess && !latestMilestone.isLoading && (
        <SurveysPage />
      )}
      {latestMilestone.isError &&
        !latestMilestone.isLoading &&
        (latestMilestone.error as any).response?.data.message.includes(
          "Survey milestone not found"
        ) && (
          <>
            <SurveyWelcomeAlertDialog
              showModal={showModal}
              setShowModal={setShowModal}
              type="a"
            />
            <div className="bg-[url(/assets/milestones-bg.svg)] w-full h-[calc(100vh-72px)] lg:h-[calc(100vh-150px)]">
              <div className="bg-white py-3 shadow-md shadow-black/5">
                <div className="container px:2 sm:px-4 flex justify-end items-center gap-4">
                  <div className="flex justify-between items-center gap-4">
                    <ShadButton
                      className="auth-btn"
                      onClick={() => {
                        router.push("/surveys/create-survey");
                      }}
                    >
                      Create Survey
                    </ShadButton>
                    <ShadButton
                      onClick={() => router.push("/surveys/survey-list")}
                      className="border rounded-lg border-[#5b03b2] text-[#5b03b2] hover:bg-[#5b03b210] bg-white"
                    >
                      Created Surveys
                    </ShadButton>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 1, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1, y: 100 }}
                transition={{
                  duration: 0.5,
                  ease: [0.43, 0.13, 0.23, 0.96], // Custom easing function for a bouncy effect
                }}
                className="p-0 m-0 bg-transparent rounded-lg shadow-lg"
              >
                <Milestones
                  stage={"0"}
                  surveyId={latestMilestone.data?.survey_id!}
                />
              </motion.div>
            </div>
          </>
        )}
    </>
  );
};

export default Page;
