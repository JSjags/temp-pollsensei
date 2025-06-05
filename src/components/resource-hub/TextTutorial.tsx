"use client";

import { useGetTutorials, usePublicGetTutorials } from "@/hooks/useGetRequests";
import { TUTORIAL_ENUM } from "@/services/api/constants.api";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "@/lib/helpers";
import { FadeLoader } from "react-spinners";
import PageControl from "../common/PageControl";
import { DEFAULT_API_PAGE_SIZE } from "@/services/api/tutorial";
import { ChatBotIcon } from "../icons";
import Link from "next/link";
import routes from "@/config/routes";

const TextTutorial = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = usePublicGetTutorials({
    page: currentPage,
    filter: TUTORIAL_ENUM.text,
  });

  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / DEFAULT_API_PAGE_SIZE);

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < totalPages ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton loader: 8 cards with pulsing effect
          // Skeleton loader: 4 cards with pulsing effect
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-white flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="w-full aspect-video bg-gray-200" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-full mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto" />
              </div>
            </div>
          ))
        ) : error ? (
          // Error component
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <svg
              className="w-12 h-12 text-red-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9l6 6m0-6l-6 6"
              />
            </svg>
            <span className="text-sm text-red-500 font-medium">
              Something went wrong. Please try again later.
            </span>
          </div>
        ) : (
          data?.data?.map((article: any, index: any) => (
            <Link
              href={routes.SINGLE_ARTICLE_PAGE(article?.slug)}
              key={article?.slug || index}
              className="bg-white flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              tabIndex={0}
              aria-label={article?.title || "View article"}
            >
              <div className="w-full flex justify-center items-center bg-gray-50 !p-0 !m-0">
                {(() => {
                  const media = article?.media?.[0];
                  if (media?.type?.startsWith("image/") && media?.url) {
                    return (
                      <div className="w-full h-40 relative mt-0">
                        <Image
                          src={media.url}
                          alt={article?.title || "Article image"}
                          fill
                          className="object-cover w-full h-full"
                          priority
                          unoptimized
                        />
                      </div>
                    );
                  }
                  if (media?.type?.includes("video") && media?.url) {
                    return (
                      <div className="w-full h-40 relative mt-0 flex items-center justify-center bg-black/5">
                        <video
                          loop
                          muted
                          autoPlay
                          playsInline
                          controls={false}
                          className="object-cover w-full h-full rounded-t-lg"
                          poster={media?.thumbnail || undefined}
                          aria-label={
                            article?.title
                              ? `Preview video for ${article.title}`
                              : "Article video"
                          }
                          tabIndex={-1}
                        >
                          <source src={media.url} type={media.type} />
                          Your browser does not support the video tag.
                        </video>
                        {/* Overlay play icon for better affordance */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg
                            className="w-12 h-12 text-white/80 drop-shadow-lg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="12"
                              fill="black"
                              fillOpacity="0.3"
                            />
                            <polygon points="10,8 16,12 10,16" fill="white" />
                          </svg>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="w-full text-3xl md:text-4xl lg:text-5xl aspect-video flex items-center justify-center text-purple-400">
                      <ChatBotIcon />
                    </div>
                  );
                })()}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <h2 className="text-base sm:text-lg line-clamp-1 custom-break-characters text-center font-semibold text-gray-900">
                  {article?.title || "Untitled"}
                </h2>
                <h3 className="text-sm line-clamp-3 custom-break-characters text-center text-gray-600">
                  {article?.description || "No description available."}
                </h3>
                <div className="flex justify-center mt-2">
                  <span className="text-xs text-gray-400">
                    {article?.createdAt ? formatDate(article.createdAt) : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex-1 flex items-center min-h-[32px]">
          {totalItems > 0 ? (
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-purple-600">
                {((currentPage - 1) * 20 + 1).toLocaleString()}
              </span>
              {" - "}
              <span className="font-semibold text-purple-600">
                {Math.min(currentPage * 20, totalItems).toLocaleString()}
              </span>
              {" of "}
              <span className="font-semibold text-gray-900">
                {totalItems.toLocaleString()}
              </span>
              {" articles"}
            </span>
          ) : (
            <span className="text-sm text-gray-400">No articles found.</span>
          )}
        </div>
        <div className="flex-shrink-0">
          <PageControl
            currentPage={currentPage}
            totalPages={totalPages}
            onNavigate={navigatePage}
          />
        </div>
      </div>
    </div>
  );
};

export default TextTutorial;
