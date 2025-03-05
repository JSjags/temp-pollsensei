"use client";

import Loading from "@/components/primitives/Loader";
import Milestones from "@/components/survey/Milestones";
import { generateMilestoneStage } from "@/lib/utils";
import {
  getLatestSurveyMilestone,
  getSurveyMilestoneById,
} from "@/services/analysis";
import { useFetchASurveyQuery } from "@/services/survey.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SingleSurvey() {
  const params = useParams();
  const { data } = useFetchASurveyQuery(params.id);

  const surveyMilestone = useQuery({
    queryKey: ["latest-milestone"],
    queryFn: () => getSurveyMilestoneById(String(params.id)),
  });

  return (
    <div className="bg-[url(/assets/milestones-bg.svg)]">
      {surveyMilestone.isLoading && (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loading />
        </div>
      )}
      {surveyMilestone.isSuccess && surveyMilestone.data?.current_stage && (
        <Milestones
          stage={generateMilestoneStage(
            surveyMilestone.data?.current_stage ?? "0"
          )}
          survey={surveyMilestone.data}
          surveyId={String(params.id)}
          generated_by={surveyMilestone.data?.generated_by}
          survey_type={surveyMilestone.data?.survey_type}
        />
      )}
    </div>
  );
}
