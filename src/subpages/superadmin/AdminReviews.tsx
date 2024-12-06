"use client"

import { useGetReviewQuery } from "@/services/superadmin.service";
import React, { useState } from "react";

interface ReviewData {
  _id: string;
  survey_id: string;
  field_description: string;
  suggested_improvement: string;
  overall_satisfaction: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsProps {
  data: ReviewData[];
}

const AdminReviews: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const { data } = useGetReviewQuery(currentPage)

  console.log(data)

  // Sort reviews by creation date (newest first)
  // const sortedReviews = data?.data?.sort(
  //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  // );

  // Pagination
  // const indexOfLastReview = currentPage * reviewsPerPage;
  // const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  // const currentReviews = sortedReviews.slice(
  //   indexOfFirstReview,
  //   indexOfLastReview
  // );

  const currentReviews = []

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>

      {/* Reviews List */}
      <div className="space-y-4">
        {data?.data?.data?.map((review:any) => (
          <div
            key={review._id}
            className="p-4 border border-gray-300 rounded-md shadow-sm bg-white"
          >
            <div className="mb-2">
              <span className="font-semibold text-gray-800">
                Field Description:
              </span>{" "}
              {review.field_description}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-800">
                Suggested Improvement:
              </span>{" "}
              {review.suggested_improvement}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-800">
                Overall Satisfaction:
              </span>{" "}
              {review.overall_satisfaction}
            </div>
            <div className="text-sm text-gray-500">
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(review.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Updated At:</span>{" "}
                {new Date(review.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border ${
            currentPage === 1
              ? "border-gray-300 text-gray-400"
              : "border-gray-500 text-gray-700 hover:bg-gray-100"
          } rounded-md`}
        >
          Previous
        </button>
        <span className="px-4 py-1">{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastReview >= data.length}
          className={`px-3 py-1 border ${
            indexOfLastReview >= data.length
              ? "border-gray-300 text-gray-400"
              : "border-gray-500 text-gray-700 hover:bg-gray-100"
          } rounded-md`}
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default AdminReviews;
