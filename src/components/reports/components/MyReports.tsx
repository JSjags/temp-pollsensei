import React, { useState } from "react";
import { useAllSurveys } from "../queries/useCategories";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button as ShadButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { More } from "@/assets/images";
import { SearchIcon } from "lucide-react";
import { FilterButton } from "./filter";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function MyReports() {
  const [page, setPage] = useState(1);
  const { data: surveyData, isLoading: allSurveysLoading } =
    useAllSurveys(page);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-2xl">My Reports</h4>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-lg bg-white p-2 md:min-w-[292px]">
            <SearchIcon className="text-[#9D50BB]" size={20} />
            <input
              type="search"
              placeholder="Search Survey"
              className="w-full bg-transparent"
            />
          </div>
          <FilterButton />
        </div>
      </div>
      <h5 className="font-bold text-lg">Surveys</h5>

      {/* Empty State */}
      {!allSurveysLoading && surveyData?.data?.length === 0 && (
        <Card className="w-full max-w-3xl mx-auto mt-[10vh] border-none shadow-none bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center p-6 text-center space-y-8"
          >
            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-full max-w-[320px] aspect-square"
            >
              <Image
                src="/assets/survey-list/no-survey.svg"
                alt="No surveys created"
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4 max-w-[600px]"
            >
              <p className="text-base text-muted-foreground">
                You have not created any report yet. Think on how to start? We
                can help you do the difficult part using our generative-AI
                capabilities to create your dream survey.
              </p>
            </motion.div>

            {/* Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ShadButton
                className="auth-btn text-white px-8 !h-12 text-lg rounded-lg hover:scale-105 transition-transform"
                onClick={() => router.push("/surveys/create-survey")}
              >
                Create Survey
              </ShadButton>
            </motion.div>
          </motion.div>
        </Card>
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allSurveysLoading
          ? Array.from({ length: 9 }).map((_, index) => (
              <SurveyCardSkeleton key={index} />
            ))
          : surveyData?.data?.map((survey: SurveyCardProps) => (
              <SurveyCard
                key={survey.survey._id}
                survey={survey.survey}
                report_count={survey.report_count}
                onClick={() => router.push(`/reports/${survey.survey._id}`)}
              />
            ))}
      </div>
    </div>
  );
}

function SurveyCard({
  survey,
  report_count,
  onClick,
  className,
}: SurveyCardProps) {
  const handleMoreClick = (e: React.MouseEvent) => {
    // Prevent the card's onClick from firing when the More icon is clicked.
    e.stopPropagation();
    console.log("More options clicked for", survey._id);
    // TODO: open context menu, action sheet, etc.
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group border max-w-[400px] rounded-[10.43px] py-8 px-4 bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2 w-full">
        <h4 className="text-xl">{survey.topic}</h4>
        <Image
          src={More}
          alt="More options"
          width={24}
          height={24}
          onClick={handleMoreClick}
        />
      </div>

      <p className="text-xs text-[#838383] mb-3">
        Created: {new Date(survey.createdAt).toLocaleDateString()}
      </p>

      <div className="text-xs bg-[#E6FBD9] text-[#0F5B1D] px-2 py-1 rounded-full inline-block mb-3">
        Reports Generated: {report_count}
      </div>

      <div className="flex justify-end">
        <ArrowRight
          className="w-5 h-5 mt-2 transition-transform duration-300 ease-out group-hover:-translate-x-1 sm:group-hover:-translate-x-2"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function SurveyCardSkeleton() {
  return (
    <div className="border max-w-[400px] rounded-[10.43px] py-8 px-4 bg-white">
      <Skeleton className="h-7 w-full mb-2" />
      <Skeleton className="h-5 w-1/2 mb-3" />
      <Skeleton className="h-5 w-2/4 mb-4" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
}

type SurveyCardProps = {
  report_count: number;
  survey: {
    _id: string;
    topic: string;
    description: string;
    createdAt: string;
  };
  onClick?: () => void;
  className?: string;
};
