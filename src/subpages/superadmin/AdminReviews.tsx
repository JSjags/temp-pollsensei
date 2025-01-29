
"use client";

import PageControl from "@/components/common/PageControl";
import { useGetReviewQuery } from "@/services/superadmin.service";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import { generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";

interface Answer {
  question: string;
  question_type: string;
  selected_options?: string[];
  text?: string;
  _id: string;
}
interface UserId {
  name: string;
  email: string;
  country?: string;
}

interface ReviewData {
  _id: string;
  survey_id: string;
  user_id: any;
  reviews: Answer[];
  createdAt: string;
  updatedAt: string;
}

const AdminReviews: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);
  const { data, isLoading, error, refetch, isFetching } = useGetReviewQuery(currentPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / reviewsPerPage);

  const openModal = (reviews:ReviewData) => {
    setSelectedReview(reviews);
    setIsModalOpen(true);
    console.log(reviews)
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const reviews: ReviewData[] = data?.data?.data || [];

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

  const statusColorMap = ["#FFC107", "#3498DB", "#27AE60", "#2980B9", "#2ECC71", "#E74C3C", "#FF5733", "#FF5733", "#FF5733",
  ];
  const getRandomColor = () => {
    return statusColorMap[Math.floor(Math.random() * statusColorMap.length)];
  };


  console.log(reviews)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer Reviews</h1>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border-gray-200 overflow-x-auto">
          <thead className="bg-gray-100">
          <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Respondent Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Respondent Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Country
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Answers
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Created At
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="text-center ">
                    <span className="flex justify-center items-center" >
                    <FadeLoader height={10} radius={1} className="mt-3" />
                    </span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center ">
                    <span className="flex justify-center items-center text-xs text-red-500" >
                    Something went wrong
                    </span>
                  </td>
                </tr>
              ) :
              reviews?.map((review: any, index: number) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-[#F7EEFED9]" : "bg-[#FEF5FED6]"
                } text-sm rounded-md`}
              >
                <td className="py-3 px-4 flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={(review as any)?.photo_url ?? ""}
                    alt="@johndoe"
                  />
                  <AvatarFallback className={`font-semibold  `} style={{backgroundColor: getRandomColor()}}>
                    {generateInitials(review?.user_id?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                   {review?.user_id?.name}</td>
               
                <td className="py-3 px-4">{review?.user_id?.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                    {review?.user_id?.country || "Not Provided"}
                  </td>
                <td className="py-3 px-4">
                  {review?.collaborators ? review.collaborators : "Not Available"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {new Date(review.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 cursor-pointer px-4 py-2"  onClick={() => openModal(review)}>
                    View
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              <X className="w-5 h-5 font-extrabold" strokeWidth={3} />
            </button>
            <h3 className="text-lg font-semibold text-blue-600">
              {selectedReview?.user_id?.name}&apos;s review
            </h3>

            {selectedReview?.reviews.map((item) => {
        // Determine the answer key dynamically based on question_type
        const answer =
          item.question_type === "short_text"
            ? item?.text || "No response provided"
            : item?.selected_options?.[0] || "No response provided";

        return (
          <div key={item._id} className="flex flex-col py-2">
            <p className="text-black font-semibold">Q: {item.question}</p>
            <p className="text-[#5B03B2] font-normal">A: {answer}</p>
          </div>
        );
      })}

           
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8 flex justify-between items-center">
        <p className="text-xs font-medium">
          {totalItems > 0
            ? `Showing ${(currentPage - 1) * reviewsPerPage + 1}-${Math.min(
                currentPage * reviewsPerPage,
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

export default AdminReviews;
