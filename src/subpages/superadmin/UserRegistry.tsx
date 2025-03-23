"use client";

import { ImFilter } from "react-icons/im";
import React, { useMemo, useState } from "react";
import {
  useResetUserPasswordMutation,
  useUpdateDisableStatusMutation,
  useUserRegistryQuery,
} from "@/services/superadmin.service";
import PageControl from "@/components/common/PageControl";
import DropdownFilter from "@/components/superAdmin/DropdownFilter";
import { generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeLoader } from "react-spinners";
import { formatDateOption } from "@/lib/helpers";
import { Switch } from "@/components/ui/switch";
import { FaBullseye, FaKey, FaUserCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUserTimes } from "react-icons/fa";
import { Lock, UserCheck2, UserRoundMinusIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";
import UserDetailsDialog from "@/components/superAdmin/UserDetailsDialog";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";

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
    { label: "Basic Plan", value: "Basic Plan" },
    { label: "Pro Plan", value: "Pro Plan" },
    { label: "Team Plan", value: "Team Plan" },
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

const UserRegistry: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<PathParamsProps>({});
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationType, setConfirmationType] = useState<"reset" | "status">(
    "reset"
  );
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const path_params: PathParamsProps = {};
  if (email) path_params.email = email;

  const { data: locationData } = useQuery({
    queryKey: ["userLocations"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/superadmin/users/location?page=1&page_size=20"
      );
      return response.data;
    },
  });

  const refactoredData = useMemo(() => {
    if (!locationData?.data) return [];

    return locationData.data.map((location: string) => ({
      label: location,
      value: location.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [locationData]);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["userRegistry", currentPage, selectedFilters, email],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("page", currentPage.toString());
      params.append("page_size", "20");

      if (selectedFilters.subscription_type) {
        params.append("subscription_type", selectedFilters.subscription_type);
      }
      if (selectedFilters.account_type) {
        params.append("account_type", selectedFilters.account_type);
      }
      if (selectedFilters.location) {
        params.append("location", selectedFilters.location);
      }
      if (email) {
        params.append("email", email);
      }

      const response = await axiosInstance.get(
        `/superadmin/users?${params.toString()}`
      );
      return response.data;
    },
  });

  const [updateDisabledStatus, { isLoading: isDisabling }] =
    useUpdateDisableStatusMutation();

  const [resetUserPassword, { isLoading: isResetPassword }] =
    useResetUserPasswordMutation();

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / 20);

  const handleFilterApply = (filterType: string, selected: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: selected.length > 0 ? selected[0] : undefined,
      ...(filterType === "location" && {
        location: selected.length > 0 ? selected.join(",") : undefined,
      }),
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({});
    setEmail("");
    setCurrentPage(1);
  };

  const handleSubmit = async (email: string) => {
    const editData = {
      email: email,
    };
    try {
      await updateDisabledStatus(editData).unwrap();
      refetch();
      toast.success("Status updated successfully");
      setIsConfirmationOpen(false);
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  const ResetPassword = async (email: string) => {
    const editData = {
      email: email,
    };
    try {
      await resetUserPassword(editData).unwrap();
      refetch();
      toast.success("Account password reset successfully");
      setIsConfirmationOpen(false);
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  const navigatePage = (direction: "next" | "prev") => {
    setCurrentPage((prevIndex) => {
      if (direction === "next") {
        return prevIndex < (data?.total_pages || 1) ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex > 1 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const getRandomColor = () => {
    return statusColorMap[Math.floor(Math.random() * statusColorMap.length)];
  };

  return (
    <div className="min-h-screen w-full p-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Registry</h1>

      {/* Filter Section */}
      <div className="flex flex-col gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        {/* Top row with filter button and filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter button with badge showing active filters */}
              <div className="relative">
                <button className="py-2 px-4 bg-white border border-gray-300 rounded-lg flex items-center text-sm hover:bg-gray-50 transition-colors">
                  <ImFilter size={18} className="text-gray-600 mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  {Object.keys(selectedFilters).length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {Object.keys(selectedFilters).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filters group with responsive layout */}
              <div className="flex flex-wrap gap-2">
                <DropdownFilter
                  title="Subscription"
                  options={options.subscription}
                  onApply={(selected) =>
                    handleFilterApply("subscription_type", selected)
                  }
                  selected={selectedFilters.subscription_type}
                  className="min-w-[140px]"
                />
                <DropdownFilter
                  title="Account Type"
                  options={options.accountType}
                  onApply={(selected) =>
                    handleFilterApply("account_type", selected)
                  }
                  selected={selectedFilters.account_type}
                  className="min-w-[140px]"
                />
                <DropdownFilter
                  title="Location"
                  options={refactoredData}
                  multiSelect
                  onApply={(selected) =>
                    handleFilterApply("location", selected)
                  }
                  selected={selectedFilters.location}
                  className="min-w-[140px]"
                />
              </div>

              {/* Reset button */}
              {Object.keys(selectedFilters).length > 0 && (
                <Button
                  onClick={resetFilters}
                  className="text-red-500 hover:text-red-600 bg-white border-gray-300 py-2 px-4 text-sm border rounded-lg transition-all duration-200 hover:bg-red-50 flex items-center gap-2 animate-fadeIn"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Search input */}
          <div className="relative flex-shrink-0 w-full lg:w-64">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Search by email"
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {email && (
              <button
                onClick={() => setEmail("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {Object.keys(selectedFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {Object.entries(selectedFilters).map(
              ([key, value]) =>
                value && (
                  <div
                    key={key}
                    className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span className="capitalize">{key.replace("_", " ")}:</span>
                    <span className="font-medium">{value}</span>
                    <button
                      onClick={() => handleFilterApply(key, [])}
                      className="hover:text-purple-900"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )
            )}
          </div>
        )}
      </div>

      {/* Table Section */}
      {(isLoading || isFetching) && <TableSkeleton />}

      {(!isLoading || !isFetching) && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600">
                    User Name
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600">
                    Email Address
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 hidden md:table-cell">
                    Country
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 whitespace-nowrap">
                    Total Surveys
                  </th>
                  {/* <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 hidden lg:table-cell">
                  No. of Collab...
                </th> */}
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 hidden md:table-cell">
                    Plan
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 hidden lg:table-cell">
                    Created Date
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <span className="text-red-500 flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Something went wrong
                      </span>
                    </td>
                  </tr>
                ) : data?.data?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <span className="text-gray-500">No records found</span>
                    </td>
                  </tr>
                ) : (
                  data?.data?.map((user: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={user?.photo_url ?? ""}
                              alt={user?.name}
                            />
                            <AvatarFallback
                              className="font-semibold text-white text-xs"
                              style={{ backgroundColor: getRandomColor() }}
                            >
                              {generateInitials(user?.name ?? "")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 md:hidden">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm hidden md:table-cell">
                        {user?.email}
                      </td>
                      <td className="py-3 px-4 text-sm hidden md:table-cell">
                        {user?.country || "Not Available"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.disabled[0].status
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.disabled[0].status ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm hidden lg:table-cell">
                        {user?.survey_statistics?.total || "0"}
                      </td>
                      {/* <td className="py-3 px-4 text-sm hidden lg:table-cell">
                      {user?.collaborators || "0"}
                    </td> */}
                      <td className="py-3 px-4 text-sm hidden md:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user?.plan?.name === "Team Plan"
                              ? "bg-purple-100 text-purple-800"
                              : user?.plan?.name === "Pro Plan"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user?.plan ? user?.plan.name : "Free Plan"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm hidden lg:table-cell">
                        {user?.createdAt
                          ? formatDateOption(user.createdAt)
                          : "Not Available"}
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none">
                            <div className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                              <BsThreeDotsVertical className="h-4 w-4 text-gray-600" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-fit">
                            <AlertDialog
                              open={isConfirmationOpen}
                              onOpenChange={setIsConfirmationOpen}
                            >
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUserEmail(user?.email);
                                    setConfirmationType("status");
                                    setIsConfirmationOpen(true);
                                  }}
                                  className={`text-sm cursor-pointer flex items-center gap-2 ${
                                    user.disabled[0].status
                                      ? "text-green-600 focus:text-green-600"
                                      : "text-red-600 focus:text-red-600"
                                  }`}
                                >
                                  {user.disabled[0].status ? (
                                    <UserCheck2 className="h-4 w-4" />
                                  ) : (
                                    <UserRoundMinusIcon className="h-4 w-4" />
                                  )}
                                  {user.disabled[0].status
                                    ? "Activate Account"
                                    : "Deactivate Account"}
                                </DropdownMenuItem>
                              </AlertDialogTrigger>

                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUserEmail(user?.email);
                                    setConfirmationType("reset");
                                    setIsConfirmationOpen(true);
                                  }}
                                  className="text-sm cursor-pointer text-gray-600 focus:text-gray-600 flex items-center gap-2"
                                >
                                  <Lock className="h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {confirmationType === "reset"
                                      ? "Reset Password"
                                      : user.disabled[0].status
                                      ? "Activate Account"
                                      : "Deactivate Account"}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {confirmationType === "reset"
                                      ? "Are you sure you want to reset this user's password? They will receive an email with instructions to set a new password."
                                      : user.disabled[0].status
                                      ? "Are you sure you want to activate this account? The user will regain access to their account."
                                      : "Are you sure you want to deactivate this account? The user will lose access to their account."}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      if (confirmationType === "reset") {
                                        ResetPassword(selectedUserEmail);
                                      } else {
                                        handleSubmit(selectedUserEmail);
                                      }
                                    }}
                                    className={`${
                                      confirmationType === "reset"
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : user.disabled[0].status
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                    }`}
                                  >
                                    {isDisabling || isResetPassword
                                      ? "Processing..."
                                      : confirmationType === "reset"
                                      ? "Reset Password"
                                      : user.disabled[0].status
                                      ? "Activate"
                                      : "Deactivate"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDetailsOpen(true);
                              }}
                              className="text-sm cursor-pointer text-gray-600 focus:text-gray-600 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Pagination Section */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
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

      {/* Move Dialog outside of DropdownMenu */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <UserDetailsDialog user={selectedUser} isOpen={isDetailsOpen} />
      </Dialog>
    </div>
  );
};

export default UserRegistry;
