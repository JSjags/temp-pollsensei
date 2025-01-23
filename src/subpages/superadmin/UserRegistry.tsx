"use client";

import { ImFilter } from "react-icons/im";
import React, { useMemo, useState } from "react";
import {
  useResetUserPasswordMutation,
  useUpdateDisableStatusMutation,
  useUserRegistryQuery,
  useUsersLocationQuery,
} from "@/services/superadmin.service";
import PageControl from "@/components/common/PageControl";
import DropdownFilter from "@/components/superAdmin/DropdownFilter";
import { generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeLoader } from "react-spinners";
import { formatDateOption } from "@/lib/helpers";
import { Switch } from "@/components/ui/switch";
import { FaBullseye } from "react-icons/fa6";
import { toast } from "react-toastify";

interface SubmitData {
  email: string;
  organization_id?: string;
}

interface PathParamsProps {
  subscription_type?: string;
  account_type?: string;
  location?: string;
  email?: string;
}

const options = {
  subscription: [
    { label: "Premium Plan", value: "Team Plan" },
    { label: "Free Plan", value: "Basic Plan" },
    { label: "Pro Plan", value: "Pro Plan" },
  ],
  accountType: [
    { label: "Individual", value: "individual" },
    { label: "Organisation", value: "organization" },
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

  const { data: location } = useUsersLocationQuery(1);
  console.log(location);

  const refactoredData = location?.data?.data?.map((item: any) => ({
    label: item,
    value: item.replace(/\s+/g, "-"),
  }));

  const queryArgs = useMemo(() => {
    const params = { ...selectedFilters, email: email || undefined };
    return {
      pagesNumber: currentPage,
      ...params,
    };
  }, [currentPage, selectedFilters, email]);

  console.log(selectedFilters);
  const { data, isLoading, error, refetch, isFetching } =
    useUserRegistryQuery(queryArgs);

  const [updateDisabledStatus, { isLoading: isDisabling }] =
    useUpdateDisableStatusMutation();

  const [resetUserPassword, { isLoading: isResetPassword }] =
    useResetUserPasswordMutation();

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

  const handleFilterApply = (filterType: string, selectedOptions: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: selectedOptions.length > 0 ? selectedOptions : undefined,
    }));
  };

  // const resetFilters = () => {
  //   setSelectedFilters({});
  //   setEmail("");
  //   setCurrentPage(1);
  // };
  const resetFilters = () => {
    setSelectedFilters({});
    setEmail("");
    setCurrentPage(1);
    refetch(); // Optional: Trigger a refetch to clear the results
  };

  const handleSubmit = async (email: string) => {
    const editData = {
      email: email,
    };
    console.log(editData);
    try {
      await updateDisabledStatus(editData).unwrap();
      refetch();
      toast.success("Status updated successfully");
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };
  const ResetPassword = async (email: string) => {
    const editData = {
      email: email,
    };
    console.log(editData); 
    try {
      await resetUserPassword(editData).unwrap();
      refetch();
      toast.success("Account password reset successfully");
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
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

  console.log(data);

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <h1 className="text-sm font-bold mb-6">User Registry</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-">
          <button className="py-2 px-4 bg-white border border-gray-300 rounded-l-full flex items-center text-sm">
            <ImFilter size={20} />
          </button>
          {/* <button className="py-2 px-4 bg-white border border-gray-300 rounded- flex items-center text-sm">
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
          </button> */}
          <DropdownFilter
            title="Subscription"
            options={options.subscription}
            onApply={(selected) =>
              handleFilterApply("subscription_type", selected)
            }
          />
          <DropdownFilter
            title="Account Type"
            options={options.accountType}
            onApply={(selected) => handleFilterApply("account_type", selected)}
          />
          <DropdownFilter
            title="Location"
            options={refactoredData}
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
              <th className="text-left py-3 px-4 font-medium text-sm">
                Action
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
                  <td className="py-3 px-4 flex gap-2 items-center">
                    <button
                      onClick={() => handleSubmit(user?.email)}
                      disabled={isDisabling}
                      className={`px-2 py-2 rounded-md text-white text-sm ${
                        isDisabling
                          ? "bg-gray-400 cursor-not-allowed"
                          : user?.disabled[0].status
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isDisabling
                        ? "Processing..."
                        : user?.disabled[0].status
                        ? "Activate"
                        : "Deactivate"}
                    </button>

                    <button
                      onClick={()=>ResetPassword(user?.email)}
                      disabled={isResetPassword}
                      className=" py-2 px-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md disabled:bg-gray-400"
                    >
                      {isResetPassword ? "Processing..." : "Reset"}
                    </button>
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
