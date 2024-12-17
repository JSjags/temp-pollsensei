"use client";

import PageControl from "@/components/common/PageControl";
import { useAllTutorialsQuery } from "@/services/superadmin.service";
import React, { useState } from "react";
import Image from "next/image";
import { FadeLoader } from "react-spinners";

interface Card {
  title: string;
  subtitle: string;
  bgColor: string;
  hasPlayButton?: boolean;
}


const TutorialPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useAllTutorialsQuery({
    pagesNumber: currentPage,
  });

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
    refetch();
  };

  console.log(data);
  console.log(currentPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="text-center flex justify-center items-center w-full">
            <span className="flex justify-center items-center">
              <FadeLoader height={10} radius={1} className="mt-3" />
            </span>
          </div>
        ) : isError ? (
          <div className="text-center w-full">
            <span className="flex justify-center items-center text-xs text-red-500">
              Something went wrong
            </span>
          </div>
        ) : (
          data?.data?.data.map((card: any, index: number) => (
            <div
              key={index}
              className="flex flex-col bg-white shadow rounded-lg overflow-hidden"
            >
              {/* Card Background */}
              <div className={`relative h-40 flex justify-center items-center`}>
                {card.media[0].type === "image/jpeg" ? (
                  <Image
                    className="dark:invert"
                    src={card?.media[0]?.url}
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                  />
                ) : (
                  <video loop muted autoPlay className="w-full">
                    <source src={card?.media[0]?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col">
                <h3 className="text-sm font-medium text-gray-800">
                  {card?.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {card?.description}
                </p>
              </div>

              {/* Action Menu */}
              <div className="absolute top-2 right-2">
                <button className="p-2 rounded-full hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75h.008v.008H12V6.75zm0 5.25h.008v.008H12V12zm0 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-6 sm:mt-8 flex justify-between items-center">
        <p className="text-xs font-medium">
          {totalItems > 0
            ? `Showing ${(currentPage - 1) * 20 + 1}-${Math.min(
                currentPage * 20,
                totalItems
              )} of ${totalItems}`
            : "No items to display"}
        </p>
        <PageControl
          currentPage={currentPage}
          totalPages={totalPages}
          onNavigate={navigatePage}
        />
      </div>
    </div>
  );
};

export default TutorialPage;
