import { smile1, tut1, tut2, tut4 } from "@/assets/images";
import { useTutorialQuery } from "@/services/superadmin.service";
import Image from "next/image";
import React, { useState } from "react";
import PageControl from "../common/PageControl";
import { FadeLoader } from "react-spinners";
import { formatDate } from "@/lib/helpers";

const Tutorials: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Text Articles");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useTutorialQuery({
    pagesNumber: currentPage,
    filter_by : "web"
  });
  const { data: videoData, isLoading:videoIsLOading, error:videoError, refetch: refetchVideo } = useTutorialQuery({
    pagesNumber: currentPage,
    filter_by : "video"
  });

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

  console.log(data);
  console.log(videoData);

  const articles = [
    {
      title:
        "Welcome to PollSensei: A Step-by-Step Guide to Creating Your First Survey",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl: tut1,
    },
    {
      title: "Understanding AI-Powered Survey Creation: How Our Tool Works",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl: tut2,
    },
    {
      title:
        "Welcome to PollSensei: A Step-by-Step Guide to Creating Your First Survey",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl: smile1,
    },
    {
      title: "Understanding AI-Powered Survey Creation: How Our Tool Works",
      description:
        "Creating a survey is easy on PollSensei. We make survey creation as seamless and fast as possible. Our AI bot is there...",
      date: "20th November, 2024",
      imageUrl: tut4,
    },
  ];

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-4">
        Tutorials for you
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("Text Articles")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "Text Articles"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Text Articles
        </button>
        <button
          onClick={() => setActiveTab("Videos")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "Videos"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Videos
        </button>
      </div>

      {/* Articles */}
   {
    activeTab === "Text Articles" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
        data?.data?.data?.map((article: any, index: any) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            <div
              className={`relative min-h-48 flex justify-center items-center`}
            >
              {article.media[0].type === "image/jpeg" ||
              article.media[0].type === "png" ||
              article.media[0].type === "image/png" ? (
                <Image
                  className="dark:invert w-full h-40 object-cover aspect-auto"
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
          </div>
        ))
      )}
    </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {videoIsLOading ? (
        <tr>
          <td className="text-center ">
            <span className="flex justify-center items-center">
              <FadeLoader height={10} radius={1} className="mt-3" />
            </span>
          </td>
        </tr>
      ) : videoError ? (
        <tr>
          <td className="text-center ">
            <span className="flex justify-center items-center text-xs text-red-500">
              Something went wrong
            </span>
          </td>
        </tr>
      ) : (
        videoData?.data?.data?.map((article: any, index: any) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            <div
              className={`relative min-h-48 flex justify-center items-center`}
            >
              {article.media[0].type === "image/jpeg" ||
              article.media[0].type === "png" ||
              article.media[0].type === "image/png" ? (
                <Image
                  className="dark:invert w-full h-40 object-cover aspect-auto"
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
          </div>
        ))
      )}

      {/* {articles.map((article, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {article.title}
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              {article.description}
            </p>
            <p className="text-purple-600 font-semibold text-sm mt-4">
              {article.date}
            </p>
          </div>
        </div>
      ))} */}
    </div>
    )
   } 

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

export default Tutorials;
