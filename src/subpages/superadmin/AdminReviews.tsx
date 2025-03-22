"use client";

import PageControl from "@/components/common/PageControl";
import { useGetReviewQuery } from "@/services/superadmin.service";
import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import { generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [reviewsPerPage] = useState(20);
  const { data, isLoading, error, refetch, isFetching } =
    useGetReviewQuery(currentPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / reviewsPerPage);

  const openModal = (reviews: ReviewData) => {
    setSelectedReview(reviews);
    setIsModalOpen(true);
    console.log(reviews);
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

  const statusColorMap = [
    "#FFC107",
    "#3498DB",
    "#27AE60",
    "#2980B9",
    "#2ECC71",
    "#E74C3C",
    "#FF5733",
    "#FF5733",
    "#FF5733",
  ];
  const getRandomColor = () => {
    return statusColorMap[Math.floor(Math.random() * statusColorMap.length)];
  };

  const TableLoadingSkeleton = () => (
    <>
      {Array(10)
        .fill(0)
        .map((i) => (
          <tr key={i}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </td>
            <td className="px-4 py-3">
              <Skeleton className="h-4 w-[200px]" />
            </td>
            <td className="px-4 py-3">
              <Skeleton className="h-4 w-[100px]" />
            </td>
            <td className="px-4 py-3">
              <Skeleton className="h-4 w-[100px]" />
            </td>
            <td className="px-4 py-3">
              <Skeleton className="h-8 w-[80px]" />
            </td>
          </tr>
        ))}
    </>
  );

  console.log(reviews);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Customer Reviews
        </h1>
        <Badge variant="secondary" className="hidden md:flex">
          Total Reviews: {totalItems}
        </Badge>
      </div>

      {/* Mobile view - Cards */}
      <div className="md:hidden space-y-4">
        {isLoading || isFetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[200px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Something went wrong
          </div>
        ) : (
          reviews?.map((review: ReviewData) => (
            <Card key={review._id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review?.user_id?.photo_url} />
                    <AvatarFallback
                      style={{ backgroundColor: getRandomColor() }}
                      className="text-white"
                    >
                      {generateInitials(review?.user_id?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{review?.user_id?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {review?.user_id?.email}
                    </p>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p>Country: {review?.user_id?.country || "Not Provided"}</p>
                  <p>Date: {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openModal(review)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Responses
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Respondent
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Country
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading || isFetching ? (
              <TableLoadingSkeleton />
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-red-500">
                  Something went wrong
                </td>
              </tr>
            ) : (
              reviews?.map((review: ReviewData) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review?.user_id?.photo_url} />
                        <AvatarFallback
                          style={{ backgroundColor: getRandomColor() }}
                          className="text-white"
                        >
                          {generateInitials(review?.user_id?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {review?.user_id?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {review?.user_id?.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {review?.user_id?.country || "Not Provided"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(review)}
                      className="hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-lg max-h-[80vh] overflow-y-auto z-[100000]"
          overlayClassName="z-[100000]"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedReview?.user_id?.photo_url} />
                <AvatarFallback
                  style={{ backgroundColor: getRandomColor() }}
                  className="text-white"
                >
                  {generateInitials(selectedReview?.user_id?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedReview?.user_id?.name}&apos;s Review
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(
                    selectedReview?.createdAt ?? ""
                  ).toLocaleDateString()}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedReview?.reviews.map((item) => {
              const answer =
                item.question_type === "short_text"
                  ? item?.text
                  : item?.selected_options?.[0];

              return (
                <div key={item._id} className="space-y-2">
                  <p className="font-medium text-gray-900">{item.question}</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                    {answer || "No response provided"}
                  </p>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
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
