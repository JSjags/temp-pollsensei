import routes from "@/config/routes";
import { formatDate } from "@/lib/helpers";
import { useTutorialQuery } from "@/services/superadmin.service";
import { ITutorial } from "@/types/api/tutorials.types";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import PageControl from "../common/PageControl";

type Article = {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  id: string;
};

const ArticlesGrid: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useTutorialQuery({
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
            <div className="text-center ">
              <span className="flex justify-center items-center">
                <FadeLoader height={10} radius={1} className="mt-3" />
              </span>
            </div>
          </>
        ) : error ? (
          <>
            <div className="text-center ">
              <span className="flex justify-center items-center text-xs text-red-500">
                Something went wrong
              </span>
            </div>
          </>
        ) : (
          data?.data?.data?.map((article: ITutorial, index: any) => (
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
    </section>
  );
};

export default ArticlesGrid;
