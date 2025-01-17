"use client";

import AppLoadingSkeleton from "@/components/common/AppLoadingSkeleton";
import EmptyTableData from "@/components/common/EmptyTableData";
/* eslint-disable react/no-unescaped-entities */
import { formatDate } from "@/lib/helpers";
import { handleApiErrors, isValidResponse } from "@/lib/utils";
import { getSingleTutorial } from "@/services/api/tutorial";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const ArticleDetails: React.FC = () => {
  const params = useParams();
  const id = params?.id?.toString();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["getSingleTutorial", "article", id],
    queryFn: async () => {
      const response = await getSingleTutorial(id);
      if (isValidResponse(response)) {
        return response;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  console.log(data);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-gray-800">
      {isLoading || isRefetching ? (
        <div className="flex flex-col gap-y-6">
          <div className="w-full">
            <AppLoadingSkeleton className="w-full h-4 mb-2 max-w-80" />
            <AppLoadingSkeleton className="w-full h-3 max-w-40" />
          </div>
          <AppLoadingSkeleton className="w-full  aspect-video rounded " />
          <div className="flex flex-col gap-y-3">
            <AppLoadingSkeleton className="w-full h-3 max-w-[80%]" />
            <AppLoadingSkeleton className="w-full h-3 max-w-[70%]" />
            <AppLoadingSkeleton className="w-full h-3 max-w-[60%]" />
            <AppLoadingSkeleton className="w-full h-3 max-w-[50%]" />
            <AppLoadingSkeleton className="w-full h-3 max-w-[60%]" />
            <AppLoadingSkeleton className="w-full h-3 max-w-[70%]" />
            <AppLoadingSkeleton className="w-full h-3 max-w-[80%]" />
          </div>
        </div>
      ) : !data?.data ? (
        <EmptyTableData onRefectch={refetch} />
      ) : (
        <>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
            {data?.data?.title}
          </h1>
          <div>
            {!!data?.data?.createdAt && (
              <p className="text-sm py-5 text-gray-500">
                {formatDate(data?.data?.createdAt)}
              </p>
            )}
          </div>

          <div className={`relative flex justify-center items-center`}>
            {data?.data?.type === "image" ? (
              <Image
                className="w-full dark:invert"
                src={data?.data?.media[0]?.url}
                alt={data?.data?.title}
                width={700}
                draggable={false}
                height={300}
              />
            ) : (
              <video loop muted autoPlay className="w-full">
                <source src={data?.data?.media[0]?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <p className="text-base pt-10 text-gray-700 mb-6 leading-relaxed">
            {data?.data?.description}
          </p>

          {!!data?.data?.content && (
            <main
              className="py-10 prose"
              dangerouslySetInnerHTML={{ __html: data?.data?.content }}
            ></main>
          )}
        </>
      )}
      {/* <div className="mb-6">
        <h2 className="font-semibold text-lg">1. Keep it Simple</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>Use clear, straightforward language.</li>
          <li>Avoid jargon and technical terms.</li>
          <li>Limit questions to one concept or idea.</li>
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-lg">2. Avoid Bias and Assumptions</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>Use neutral language and avoid leading questions.</li>
          <li>Don’t assume respondents have prior knowledge.</li>
          <li>Avoid culturally or demographically specific references.</li>
        </ul>
      </div>
      <Image
        src={smile1}
        alt="Emoticon faces"
        className="w-full h-auto rounded-lg mb-6"
      />
      <div className="mb-6">
        <h2 className="font-semibold text-lg">
          3. Use Open-Ended Questions Wisely
        </h2>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>Use for exploratory or qualitative research.</li>
          <li>Limit open-ended questions to avoid respondent fatigue.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="font-semibold text-lg">Conclusion:</h2>
        <p className="text-base text-gray-700 mt-2 leading-relaxed">
          By following these guidelines, you’ll create effective survey
          questions that yield reliable and actionable data, enabling you to
          make informed decisions.
          <br />
          Still have questions? Contact our support team for expert guidance on
          crafting effective survey questions.
        </p>
      </div> */}
    </div>
  );
};

export default ArticleDetails;
