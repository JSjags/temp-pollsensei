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
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import { FadeLoader } from "react-spinners";

const ReferrerUsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const { data: searchData } = useQuery({
    queryKey: [queryKeys.REFERRERS, "search", id],
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const response = await getReferrerByIdOrCode(id);
      if (isValidResponse(response)) {
        return response?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
    enabled: !!id,
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
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="flex  mb-6 items-center gap-10">
        <Link
          replace
          href={"/referrers"}
          className="flex  shrink-0 items-center gap-2 p-2 rounded px-4 bg-gradient-to-r hover:scale-105 transition-all duration-300 active:scale-95 from-[#5B03B2] to-[#9D50BB] text-white"
        >
          <RiArrowGoBackFill />
          <span>Go back</span>
        </Link>
        <h1 className="text-sm font-bold">
          List of users{" "}
          {!!searchData?.email && `referred by ${searchData?.email}`}
        </h1>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border-gray-200 overflow-x-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-sm">
                User Name
              </th>
              {/* <th className="text-left py-3 px-4 font-medium text-sm">
                Account Type
              </th> */}
              <th className="text-left py-3 px-4 font-medium text-sm">
                Email Address
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Country
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                No. of Collab...
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center">
                    <FadeLoader height={10} radius={1} className="mt-3" />
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center text-xs text-red-500">
                    Something went wrong
                  </span>
                </td>
              </tr>
            ) : data?.data?.data?.length === 0 ||
              data?.data?.data?.length === undefined ? (
              <tr>
                <td colSpan={6} className="text-center ">
                  <span className="flex justify-center items-center py-4 text-xs text-green-500">
                    No record found
                  </span>
                </td>
              </tr>
            ) : (
              data?.data?.data?.map((user: any, index: number) => (
                <tr
                  key={index}
                  className={`text-xs ${
                    index % 2 === 0 ? "bg-[#F7EEFED9]" : "bg-[#FEF5FED6]"
                  } text-sm rounded-md`}
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={(user as any)?.photo_url ?? ""}
                        alt="@johndoe"
                      />
                      <AvatarFallback
                        className={`font-semibold  `}
                        style={{ backgroundColor: getRandomColor() }}
                      >
                        {generateInitials(user?.name ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    {user?.name}
                  </td>
                  {/* <td className="py-3 px-4">
                    {user?.account_type ? user?.account_type : "Not Available"}
                  </td> */}
                  <td className="py-3 px-4">{user?.email}</td>
                  <td className="py-3 px-4">
                    {user?.country ? user?.country : "Not Available"}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      user.disabled[0].status === true
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    <span
                      className={`py-1 px-2 rounded-full ${
                        user.disabled[0].status === true
                          ? "bg-[#FFEBED]"
                          : "bg-[#D3FAEC]"
                      }`}
                    >
                      {user.disabled[0].status === true ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 text-center px-4">
                    {user?.collaborators ? user?.collaborators : "0"}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      user?.plan?.name === "Team Plan"
                        ? "text-purple-600"
                        : user?.plan?.name === "Pro Plan"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {user?.plan ? user?.plan.name : "Free Plan"}
                  </td>
                  <td className="py-3 px-4">
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

export default ReferrerUsersPage;
