"use client";

/* eslint-disable react/no-unescaped-entities */
import { cratf, smile1 } from "@/assets/images";
import { formatDate } from "@/lib/helpers";
import { useViewTutorialQuery } from "@/services/superadmin.service";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const ArticleDetails: React.FC = () => {
  const params = useParams();
  const { data, isLoading, error } = useViewTutorialQuery(params?.id);
  console.log(data);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-gray-800">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          {data?.data?.title}
        </h1>
        <p className="text-sm text-gray-500 mt-2">10 mins read</p>
        <p className="text-sm text-gray-500">
          {formatDate(data?.data?.createdAt)}
        </p>
      </div>

      <div className={`relative flex justify-center items-center`}>
        {data?.data?.type === "image" ? (
          <Image
            className="dark:invert"
            src={data?.data?.media[0]?.url}
            alt={data?.data?.title}
            width={700}
            height={300}
          />
        ) : (
          <video loop muted autoPlay className="w-full">
            <source src={data?.data?.media[0]?.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

     
      <p className="text-base text-gray-700 mb-6 leading-relaxed">
       {data?.data?.description}
      </p>
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
