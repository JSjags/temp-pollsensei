import routes from "@/config/routes";
import { formatDate } from "@/lib/helpers";
import { useTutorialQuery } from "@/services/superadmin.service";
import { ITutorial } from "@/types/api/tutorials.types";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import PageControl from "../common/PageControl";
import { TUTORIAL_ENUM } from "@/services/api/constants.api";
import { useGetTutorials, usePublicGetTutorials } from "@/hooks/useGetRequests";
import EmptyState from "../common/EmptyState";
import { LibraryBigIcon } from "lucide-react";

type Article = {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  id: string;
};

const ArticlesGrid: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = usePublicGetTutorials({
    page: currentPage,
    filter: TUTORIAL_ENUM.web,
  });

  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

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
    <section className="py-8 bg-gray-50 px-5 md:px-20">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Articles for you
      </h2>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105" onClick={()=>router.push(`/resource-hub/articles/${article.title}`)}>
            <Image src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200">{article.title}</h3>
              <p className="text-gray-600 mt-2">{article.description}</p>
              <p className="text-sm text-gray-500 mt-4">{article.date}</p>
            </div>
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {Array.from({ length: 8 }).map((_, idx) => (
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
            ))}
          </>
        ) : error ? (
          <>
            <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh] w-full">
              <div className="flex flex-col items-center bg-white rounded-lg shadow-md px-8 py-10 border border-red-200">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="#fee2e2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01"
                      className="text-red-600"
                      stroke="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  Something went wrong
                </h3>
                <p className="text-gray-500 text-sm text-center max-w-xs">
                  We couldn't load the tutorials at this time. Please try
                  refreshing the page or check your internet connection.
                </p>
              </div>
            </div>
          </>
        ) : data?.data && data?.data?.length > 0 ? (
          data?.data?.map((article: ITutorial, index: any) => (
            <Link
              href={routes.SINGLE_ARTICLE_PAGE(article.slug)}
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <div
                className={`relative min-h-48 flex justify-center items-center`}
              >
                {!!article?.media &&
                (article?.media?.[0]?.type === "image/jpeg" ||
                  article?.media?.[0]?.type === "png" ||
                  article?.media?.[0]?.type === "image/png") ? (
                  <Image
                    className="dark:invert w-full  h-full object-cover "
                    src={article?.media[0]?.url}
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                  />
                ) : (
                  <video loop muted autoPlay className="w-full">
                    <source src={article?.media[0]?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {/* <Image src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" /> */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {article.title}
                </h2>
                {/* <p className="text-gray-600 text-sm mt-2">{article.description}</p> */}
                <p className="text-purple-600 font-semibold text-sm mt-4">
                  {formatDate(article.createdAt)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh] w-full">
            <EmptyState
              title="No videos found"
              description="We couldn't find any videos matching your search or filters. Try adjusting your criteria or check back later for new content."
              icon={
                <LibraryBigIcon className="w-12 h-12 text-purple-400 mx-auto" />
              }
            />
          </div>
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
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </section>
  );
};

export default ArticlesGrid;
