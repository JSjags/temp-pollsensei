"use client";
import React, { FC, useMemo, useRef } from "react";
import SurveyCard from "@/components/earn/SurveyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScrollWithRef } from "@/hooks/useInfiniteScroll";

interface Props {
  applySurveys: any;
  applicationSurveys: any;
  isLoading: boolean;
  activeTab: string;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const Apply: FC<Props> = ({
  applySurveys,
  applicationSurveys,
  isLoading,
  activeTab,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useInfiniteScrollWithRef(containerRef, {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    threshold: 200,
  });

  const flattenedSurveys = useMemo(() => {
    if (!applySurveys?.pages) return [];

    return applySurveys.pages.reduce((acc: any[], page: any) => {
      return [...acc, ...(page?.data || [])];
    }, []);
  }, [applySurveys]);

  const flattenedApplicationSurveys = useMemo(() => {
    if (!applicationSurveys?.pages) return [];

    return applicationSurveys.pages.reduce((acc: any[], page: any) => {
      return [...acc, ...(page?.data || [])];
    }, []);
  }, [applicationSurveys]);

  if (isLoading) {
    return (
      <div className="w-full h-auto grid grid-cols-2 lg:grid-cols-4 gap-5 items-center">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] lg:h-[250px] w-full" />
        ))}
      </div>
    );
  }

  if (!flattenedSurveys || flattenedSurveys.length === 0) {
    return (
      <div className="w-full h-[100px] lg:h-[150px] flex items-center justify-center">
        <p className="text-[#333333] text-sm">No Available Surveys</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-auto max-h-[65vh] overflow-y-auto"
    >
      <div className="w-full h-auto grid grid-cols-2 lg:grid-cols-4 gap-5 items-center">
        {flattenedSurveys.map((survey: any, index: number) => (
          <SurveyCard
            key={`${survey?._id || survey?.survey?._id}-${index}`}
            survey={survey}
            activeTab={activeTab}
            applicationSurveys={{ data: flattenedApplicationSurveys }}
          />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="w-full h-auto grid grid-cols-2 lg:grid-cols-4 gap-5 items-center mt-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`loading-${index}`}
              className="h-[200px] lg:h-[250px] w-full"
            />
          ))}
        </div>
      )}

      {!hasNextPage && flattenedSurveys.length > 0 && (
        <div className="w-full flex justify-center mt-8 mb-4">
          <p className="text-[#AAAAAA] text-sm">No more surveys to load</p>
        </div>
      )}
    </div>
  );
};

export default Apply;
