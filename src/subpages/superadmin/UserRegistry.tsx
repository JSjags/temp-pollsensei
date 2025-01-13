"use client";

import { ImFilter } from "react-icons/im";
import React, { useMemo, useState } from "react";
import { useUserRegistryQuery } from "@/services/superadmin.service";
import PageControl from "@/components/common/PageControl";
import DropdownFilter from "@/components/superAdmin/DropdownFilter";
import { generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeLoader } from "react-spinners";
import { formatDateOption } from "@/lib/helpers";

interface PathParamsProps {
  subscription_type?: string;
  account_type?: string;
  location?: string;
  email?: string;
}

const options = {
  subscription: [
    { label: "Premium Plan", value: "premium" },
    { label: "Free Plan", value: "free" },
    { label: "Pro Plan", value: "pro" },
  ],
  accountType: [
    { label: "Individual", value: "individual" },
    { label: "Organisation", value: "organisation" },
  ],
  location: [
    { label: "Europe", value: "europe" },
    { label: "South America", value: "south-america" },
    { label: "United States", value: "us" },
    { label: "Africa", value: "africa" },
    { label: "Great Britain", value: "great-britain" },
    { label: "Asia Pacific", value: "asia-pacific" },
    { label: "North America", value: "north-america" },
    { label: "Australia", value: "australia" },
  ],
};

const UserRegistry: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<PathParamsProps>({});

  const path_params: PathParamsProps = {};
  if (email) path_params.email = email;

  const queryArgs = useMemo(() => {
    return {
      pagesNumber: currentPage,
      path_params: {
        ...selectedFilters,
        email: email || undefined,
      },
    };
  }, [currentPage, selectedFilters, email]);

  console.log(selectedFilters)
  const { data, isLoading, error, refetch } = useUserRegistryQuery(queryArgs);

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

  const handleFilterApply = (filterType: string, selectedOptions: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: selectedOptions.length > 0 ? selectedOptions : undefined,
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({});
    setEmail("");
    setCurrentPage(1);
  };

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
      <h1 className="text-sm font-bold mb-6">User Registry</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-">
          <button className="py-2 px-4 bg-white border border-gray-300 rounded-l-full flex items-center text-sm">
            <ImFilter size={20} />
          </button>
          <button className="py-2 px-4 bg-white border border-gray-300 rounded- flex items-center text-sm">
            <span className="mr-2">Filter By</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12L12 17.25 17.25 12m-11.5-6.75L12 6.75 17.25 12"
              />
            </svg>
          </button>
          <DropdownFilter
            title="Subscription"
            options={options?.subscription}
            onApply={(selected) =>
              handleFilterApply("subscription_type", selected)
            }
          />
          <DropdownFilter
            title="Account Type"
            options={options?.accountType}
            onApply={(selected) => handleFilterApply("account_type", selected)}
          />
          <DropdownFilter
            title="Location"
            options={options?.location}
            multiSelect
            onApply={(selected) => handleFilterApply("location", selected)}
          />
          <button
            onClick={resetFilters}
            className="text-red-500 bg-white border-gray-300 py-2 px-4 text-sm border rounded-r-full"
          >
            Reset Filter
          </button>
        </div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search mail"
          className="py-2 px-4 border border-gray-300 rounded-full w-64"
        />
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border-gray-200 overflow-x-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-sm">
                User Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Account Type
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Email Address
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Country
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Subscription
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                No. of Collaborators
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-sm">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
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
                  <td className="py-3 px-4">
                  {user?.account_type ? user?.account_type : "Not Available"}
                </td>
                  <td className="py-3 px-4">{user?.email}</td>
                  <td className="py-3 px-4">{user?.country ? user?.country : "Not Available"}</td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      user.subscription === "Premium"
                        ? "text-purple-600"
                        : user.subscription === "Pro Plan"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    <span
                      className={`py-1 px-2 rounded-full ${
                        user.subscription === "Premium"
                          ? "bg-[#D195FC1A]"
                          : user.subscription === "Pro Plan"
                          ? "bg-[#FFEBED]"
                          : "bg-[#D3FAEC]"
                      }`}
                    >
                      {user?.subscription ? user?.subscription : "Free Plan"}
                    </span>
                  </td>
                  <td className="py-3 text-center px-4">
                    {user?.collaborators ? user.collaborators : "0"}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      user.plan === "Premium"
                        ? "text-purple-600"
                        : user.plan === "Pro Plan"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {user?.plan ? user?.plan : "Free Plan"}
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

export default UserRegistry;
