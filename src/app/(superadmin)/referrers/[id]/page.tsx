"use client";

import PageControl from "@/components/common/PageControl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateOption } from "@/lib/helpers";
import {
  generateInitials,
  handleApiErrors,
  isValidResponse,
} from "@/lib/utils";
import { queryKeys } from "@/services/api/constants.api";
import {
  getReferrerByIdOrCode,
  getReferrerUsers,
} from "@/services/api/referrals.api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import { FadeLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
  return (
    <>
      {[...Array(20)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="py-4 px-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-40" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-6 w-16 rounded-full" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-8 mx-auto" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-6 w-20 rounded-full" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-28" />
          </td>
        </tr>
      ))}
    </>
  );
};

const ReferrerUsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const id = useParams()?.id?.toString() ?? "";

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKeys.REFERRERS, "users", currentPage],
    queryFn: async () => {
      const response = await getReferrerUsers({ pageNumber: currentPage, id });
      if (isValidResponse(response)) {
        return response;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
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

  return (
    <div className="min-h-screen w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 mb-6">
        <Link
          replace
          href={"/referrers"}
          className="flex w-fit items-center gap-2 p-2 rounded-lg px-4 bg-gradient-to-r hover:scale-105 transition-all duration-300 active:scale-95 from-[#5B03B2] to-[#9D50BB] text-white shadow-lg hover:shadow-purple-500/30"
        >
          <RiArrowGoBackFill />
          <span>Go back</span>
        </Link>
        <h1 className="text-sm sm:text-base font-bold">
          List of users{" "}
          {searchParams.get("name") && (
            <span className="text-purple-600">
              referred by {searchParams.get("name")}
            </span>
          )}
        </h1>
      </div>

      {/* Table Section with Card Style */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-100">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-sm text-purple-900">
                  User Name
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-purple-900">
                  Email Address
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-purple-900">
                  Country
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-purple-900">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-purple-900">
                  Collaborators
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-purple-900">
                  Plan
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-purple-900">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <TableSkeleton />
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <span className="flex justify-center items-center text-sm text-red-500">
                      Something went wrong
                    </span>
                  </td>
                </tr>
              ) : data?.data?.data?.length === 0 || !data?.data?.data ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <span className="flex justify-center items-center text-sm text-purple-500">
                      No record found
                    </span>
                  </td>
                </tr>
              ) : (
                data?.data?.data?.map((user: any, index: number) => (
                  <tr
                    key={index}
                    className={`text-sm hover:bg-purple-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-[#F7EEFED9]" : "bg-[#FEF5FED6]"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 ring-2 ring-purple-100">
                          <AvatarImage
                            src={user?.photo_url ?? ""}
                            alt={user?.name}
                          />
                          <AvatarFallback
                            className="font-semibold text-white"
                            style={{ backgroundColor: getRandomColor() }}
                          >
                            {generateInitials(user?.name ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user?.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user?.email}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {user?.country || "Not Available"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`py-1.5 px-3 rounded-full text-xs font-medium ${
                          user?.disabled?.[0]?.status
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user?.disabled?.[0]?.status ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-medium">
                      {user?.collaborators || "0"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`py-1.5 px-3 rounded-full text-xs font-medium ${
                          user?.plan?.name === "Team Plan"
                            ? "bg-purple-100 text-purple-700"
                            : user?.plan?.name === "Pro Plan"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user?.plan ? user?.plan.name : "Free Plan"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {user?.createdAt
                        ? formatDateOption(user.createdAt)
                        : "Not Available"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-gray-600">
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

export default ReferrerUsersPage;
