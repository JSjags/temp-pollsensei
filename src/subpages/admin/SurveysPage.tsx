import "./style.css";
import SurveyCard from "../../components/survey/SurveyCard";
import PaginationControls from "../../components/common/PaginationControls";
import FilterButton from "../../components/filter/FilterButton";
import Image from "next/image";
import { Key, useState } from "react";

import search from "../../assets/images/search.svg";
import SurveyEmptyPage from "@/components/ui/SurveyEmptyPage";
import { useFetchSurveysQuery } from "@/services/survey.service";
import { Spinner } from "flowbite-react";
import Loading from "@/components/primitives/Loader";
import Milestone from "../milestone/Milestone";
import Milestones from "@/components/survey/Milestones";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/common/Button";
import { Button as ShadButton } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLatestSurveyMilestone, getSingleSurvey } from "@/services/analysis";
import { generateMilestoneStage } from "@/lib/utils";
import SurveyWelcomeAlertDialog from "@/components/survey/SurveyWelcomeAlertDialog";
import { ClipboardList, Edit2, PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CreateSurveyButton from "@/components/reusable/CreateSurveyButton";

const SurveysPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const { data, isLoading } = useFetchSurveysQuery(currentPage);
  const router = useRouter();
  const survey = useSelector((state: RootState) => state.survey);

  const latestMilestone = useQuery({
    queryKey: ["latest-milestone"],
    queryFn: () => getLatestSurveyMilestone(),
  });

  const getSurvey = useQuery({
    queryKey: ["get-single-survey"],
    queryFn: () =>
      getSingleSurvey({ surveyId: latestMilestone.data?.survey_id! }),
    enabled: latestMilestone.isSuccess,
  });

  return (
    <div className="min-h-screen w-full">
      {showMilestones && (
        <div className="bg-white py-3 shadow-md shadow-black/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {getSurvey.isLoading ? (
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <div className="text-black/60 text-sm sm:text-base">
                  {getSurvey.data?.topic ?? ""}
                </div>
              )}
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
                <CreateSurveyButton />
                <ShadButton
                  onClick={() => router.push("/surveys/survey-list")}
                  className="border rounded-lg border-[#5b03b2] text-[#5b03b2] hover:bg-[#5b03b210] bg-white w-full sm:w-auto text-sm"
                >
                  {showMilestones && "Created Surveys"}
                </ShadButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loading />
        </div>
      )}

      {!isLoading && showMilestones && (
        <div className="bg-[url(/assets/milestones-bg.svg)] bg-cover bg-center w-full min-h-[calc(100vh-72px)] lg:min-h-[calc(100vh-150px)]">
          <SurveyWelcomeAlertDialog
            showModal={showModal}
            setShowModal={setShowModal}
            type="b"
          />
          <AnimatePresence>
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 1, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1, y: 100 }}
                transition={{
                  duration: 0.5,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                className="p-0 m-0 bg-transparent rounded-lg shadow-lg"
              >
                <Milestones
                  stage={generateMilestoneStage(
                    latestMilestone.data?.current_stage ?? "0"
                  )}
                  surveyId={latestMilestone.data?.survey_id!}
                  generated_by={latestMilestone.data?.generated_by}
                  survey_type={latestMilestone.data?.survey_type}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {data?.data.total === 0 && !isLoading && !showMilestones && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 1, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1, y: 100 }}
            transition={{
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="pt-10 px-4"
          >
            <SurveyEmptyPage />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SurveysPage;
