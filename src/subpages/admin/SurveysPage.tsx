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

const SurveysPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);
  const { data, isLoading } = useFetchSurveysQuery(currentPage);
  const router = useRouter();

  // console.log(data);
  // console.log(data?.data);
  // console.log(data?.data?.data);

  // const result = Array.from({ length: 6 }, (_, index) => `Item ${index}`);

  // const totalPages = data?.data.total;

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

  console.log(latestMilestone);

  return (
    <div>
      {showMilestones && (
        <div className="bg-white py-3 shadow-md shadow-black/5">
          <div className="container px:2 sm:px-4 flex justify-between items-center gap-4">
            <div className="text-black/60">{getSurvey.data?.topic ?? ""}</div>
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
                // onClick={() => setShowMilestones(!showMilestones)}
                onClick={() => router.push("/surveys/survey-list")}
                className="border rounded-lg border-[#5b03b2] text-[#5b03b2] hover:bg-[#5b03b210] bg-white"
              >
                {/* {showMilestones && "Created Surveys" : "Milestones"} */}
                {showMilestones && "Created Surveys"}
              </ShadButton>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loading />
        </div>
      )}
      {!isLoading && showMilestones && (
        // {data?.data.total === 0 && !isLoading && showMilestones && (
        // <SurveyEmptyPage />

        <div className="bg-[url(/assets/milestones-bg.svg)] w-full h-[calc(100vh-72px)] lg:h-[calc(100vh-150px)] mx-auto">
          <SurveyWelcomeAlertDialog
            showModal={showModal}
            setShowModal={setShowModal}
            type="b"
          />
          <AnimatePresence>
            {!isLoading && (
              // {data?.data.total === 0 && !isLoading && (
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
                  stage={generateMilestoneStage(
                    latestMilestone.data?.current_stage ?? "0"
                  )}
                  surveyId={latestMilestone.data?.survey_id!}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {data?.data.total === 0 && !isLoading && !showMilestones && (
        <AnimatePresence>
          {data?.data.total === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 1, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: 100 }}
              transition={{
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96], // Custom easing function for a bouncy effect
              }}
              className="pt-10"
            >
              <SurveyEmptyPage />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {/* {data?.data.total > 0 && !isLoading && (
        <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
          <div className="md:flex my-10 items-center justify-between">
            <div className="flex gap-5 items-center">
              <h2 className="text-[#333333] font-[700] text-[24px]">
                Your Surveys
              </h2>
              <div className="block md:hidden mt-2 md:mt-0">
                <Button label="Create new survey +" />
              </div>
              <div className="hidden lg:flex items-center pl-4 gap-2 rounded-[8px] border-[1px] px- border-[#d9d9d9] w-[292px] h-[40px]">
                <Image src={search} alt="Search icon" width={20} height={20} />
                <input
                  className="ring-0 text-[#838383] flex-1 outline-none"
                  type="text"
                  placeholder="Search surveys"
                />
              </div>
              <div className="hidden md:block">
                <FilterButton text="Add filter" />
              </div>
            </div>
            <div className="hidden md:block mt-2 md:mt-0">
              <Button label="Create new survey +" />
            </div>
            <div className="block md:hidden">
              <FilterButton text="Add filter" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
            {data && data?.data?.data?.map((item:any, it: Key | null | undefined) => (
            <SurveyCard key={it} {...item}  />
          ))}
          </div>
          <div className="mt-6 sm:mt-8">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setItemsPerPage={setItemsPerPage}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SurveysPage;
