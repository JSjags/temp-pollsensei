"use client";

import SurveyCard from "@/components/survey/SurveyCard";
import { Key, useState, useCallback, useRef } from "react";
import Button from "@/components/common/Button";
import { useFetchSurveysQuery } from "@/services/survey.service";
import Image from "next/image";
import FilterButton from "@/components/filter/FilterButton";
import search from "../../assets/images/search.svg";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PaginationBtn from "@/components/common/PaginationBtn";
import PageControl from "@/components/common/PageControl";
import { Button as ShadButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchSurveysQuery } from "@/services/survey.service";
import debounce from "lodash/debounce";
import { SearchIcon, XCircle } from "lucide-react";
import { Input } from "@/components/ui/shadcn-input";
import CreateSurveyButton from "@/components/reusable/CreateSurveyButton";
import DraftsList from "@/components/survey/DraftsList";

const CreatedSurveysPage = () => {
  const [itemsPerPage] = useState(6);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );

  // Get search params
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [searchTerm, setSearchTerm] = useState(search);
  const [debouncedTerm, setDebouncedTerm] = useState(search);
  const showDrafts = searchParams.get("view") === "drafts";

  // Update URL with search params
  const updateSearchParams = useCallback(
    (newParams: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleSearch = () => {
    setDebouncedTerm(searchTerm);
    updateSearchParams({ search: searchTerm, page: "1" });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    router.push(pathname);
  };

  // Use the search query when search params exist
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useSearchSurveysQuery(
    {
      search_term: debouncedTerm,
      status,
      page: currentPage,
      page_size: itemsPerPage,
    },
    {
      skip: !(debouncedTerm || status),
      refetchOnMountOrArgChange: true,
    }
  );

  // Use regular survey query when no search params
  const {
    data: regularData,
    isLoading: isRegularLoading,
    isFetching: isRegularFetching,
  } = useFetchSurveysQuery(currentPage, {
    skip: !!(debouncedTerm || status),
    refetchOnMountOrArgChange: true,
  });

  const data = debouncedTerm || status ? searchData : regularData;
  const isLoading =
    debouncedTerm || status ? isSearchLoading : isRegularLoading;
  const isFetching =
    debouncedTerm || status ? isSearchFetching : isRegularFetching;

  const totalItems = data?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (selectedStatus: string) => {
    updateSearchParams({ status: selectedStatus, page: "1" });
  };

  const navigatePage = (direction: "next" | "prev") => {
    const newPage =
      direction === "next"
        ? Math.min(currentPage + 1, totalPages)
        : Math.max(currentPage - 1, 1);

    updateSearchParams({ page: newPage.toString() });
  };

  const toggleDrafts = (show: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (show) {
      params.set("view", "drafts");
    } else {
      params.delete("view");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const SurveyCardSkeleton = () => (
    <div className="relative rounded-[12px] p-3 sm:p-4 border-[1px] w-full max-w-[413px] h-[314px] bg-white">
      <div>
        <div className="flex justify-between items-center mb-1 gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/3" />
      </div>

      <div className="mt-3 sm:mt-4">
        <Skeleton className="h-6 w-20 rounded-xl" />
      </div>

      <div className="mt-6 sm:mt-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-12 w-32 rounded-md" />
      </div>

      <div className="mt-6 sm:mt-[42px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );

  // Empty state for search results
  const renderEmptyState = (isSearch: boolean) => (
    <Card className="w-full max-w-3xl mx-auto mt-[10vh] border-none shadow-none bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-6 text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full max-w-[320px] aspect-square"
        >
          <Image
            src={
              isSearch
                ? "/assets/no-results.svg"
                : "/assets/survey-list/no-survey.svg"
            }
            alt={isSearch ? "No results found" : "No surveys created"}
            fill
            className="object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4 max-w-[600px]"
        >
          <h3 className="text-2xl font-semibold text-gray-800">
            {isSearch ? "No Matches Found" : "Start Your First Survey"}
          </h3>
          <p className="text-base text-muted-foreground">
            {isSearch
              ? "We couldn't find any surveys matching your criteria. Try broadening your search terms or adjusting your filters."
              : "Ready to gather valuable insights? Let our AI-powered system help you create the perfect survey in minutes. We'll handle the complex parts while you focus on what matters most."}
          </p>
        </motion.div>
        {!isSearch && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <ShadButton
              className="auth-btn text-white px-8 !h-12 text-lg rounded-lg hover:scale-105 transition-transform"
              onClick={() => router.push("/surveys/create-survey")}
            >
              Create Your First Survey
            </ShadButton>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );

  if (showDrafts) {
    return <DraftsList onBack={() => toggleDrafts(false)} />;
  }

  if (isLoading || isFetching) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
        <div className="md:flex my-10 items-center justify-between">
          <div className="flex gap-5 items-center">
            <h2 className="text-[#333333] font-[700] text-[24px]">
              Your Surveys
            </h2>
            <div className="hidden lg:flex items-center gap-2 rounded-[8px] border-[1px] bg-white border-[#d9d9d9] w-[292px] h-[40px]">
              <input
                ref={searchInputRef}
                className="ring-0 text-[#838383] flex-1 outline-none px-3"
                type="text"
                placeholder="Search surveys"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="px-3 h-full border-l border-[#d9d9d9] hover:bg-gray-50 rounded-r-lg"
              >
                <SearchIcon className="text-[#9D50BB]" />
              </button>
            </div>
            <div className="hidden md:flex">
              <FilterButton
                type="survey"
                text="Add filter"
                buttonClassName="border-[#D9D9D9]"
                onFilterChange={handleFilterChange}
                currentStatus={status}
              />
              {(search || status) && (
                <ShadButton
                  variant="ghost"
                  onClick={handleReset}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="ml-2 text-base">Reset</span>
                </ShadButton>
              )}
            </div>
          </div>
          <div className="hidden md:block mt-2 md:mt-0">
            <div className="hidden md:flex gap-3">
              {userRoles.includes("Admin") && (
                <>
                  <CreateSurveyButton />
                  <ShadButton
                    onClick={() => toggleDrafts(true)}
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg"
                  >
                    View Drafts
                  </ShadButton>
                </>
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <FilterButton text="Add filter" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SurveyCardSkeleton />
              </motion.div>
            ))}
        </div>
        <div className="mt-6 sm:mt-8 flex justify-end">
          <PageControl
            currentPage={currentPage}
            totalPages={totalPages}
            onNavigate={navigatePage}
            isLoading={isLoading || isFetching}
          />
        </div>
      </div>
    );
  }

  if (!data?.data?.total || data.data.total === 0) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 mt-0 sm:mt-0 sm:my-10">
        <div className="md:flex my-10 items-center justify-between">
          <div className="flex gap-5 items-center">
            <h2 className="text-[#333333] font-[700] text-xl">Your Surveys</h2>
            <div className="block md:hidden mt-2 md:mt-0">
              <div className="hidden md:flex gap-3">
                {userRoles.includes("Admin") && (
                  <>
                    <CreateSurveyButton />
                    <ShadButton
                      onClick={() => toggleDrafts(true)}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg"
                    >
                      View Drafts
                    </ShadButton>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 rounded-[8px] bg-white border-[1px] border-[#d9d9d9] w-[292px] h-[40px]">
              <input
                ref={searchInputRef}
                className="ring-0 text-[#838383] flex-1 outline-none px-3"
                type="text"
                placeholder="Search surveys"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="px-3 h-full border-l border-[#d9d9d9] hover:bg-gray-50 rounded-r-lg"
              >
                <SearchIcon className="text-[#9D50BB]" />
              </button>
            </div>
            <div className="hidden md:flex">
              <FilterButton
                type="survey"
                text="Add filter"
                buttonClassName="border-[#D9D9D9]"
                onFilterChange={handleFilterChange}
                currentStatus={status}
              />
              {(search || status) && (
                <ShadButton
                  variant="ghost"
                  onClick={handleReset}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="ml-2 text-base">Reset</span>
                </ShadButton>
              )}
            </div>
          </div>
          <div className="hidden md:block mt-2 md:mt-0">
            <div className="hidden md:flex gap-3">
              {userRoles.includes("Admin") && (
                <>
                  <CreateSurveyButton />
                  <ShadButton
                    onClick={() => toggleDrafts(true)}
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg"
                  >
                    View Drafts
                  </ShadButton>
                </>
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <FilterButton text="Add filter" />
          </div>
        </div>
        {renderEmptyState(false)}
      </div>
    );
  }

  if (isSearchError) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-red-600">
            Error loading surveys
          </h3>
          <p className="text-gray-600 mt-2">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {data?.data.total > 0 && (
        <div className="container px-4 sm:px-6 lg:px-8 pb-2 my-6 sm:my-10">
          <div className="md:flex my-10 items-center justify-between">
            <div className="flex gap-5 items-center">
              <h2 className="text-[#333333] font-[700] text-[24px]">
                Your Surveys
              </h2>
              <div className="block md:hidden mt-2 md:mt-0">
                <div className="hidden md:flex gap-3">
                  {userRoles.includes("Admin") && (
                    <>
                      <CreateSurveyButton />
                      <ShadButton
                        onClick={() => toggleDrafts(true)}
                        variant="outline"
                        className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg"
                      >
                        View Drafts
                      </ShadButton>
                    </>
                  )}
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 rounded-[8px] border-[1px] bg-white border-[#d9d9d9] w-[292px] h-[40px]">
                <input
                  ref={searchInputRef}
                  className="ring-0 text-[#838383] flex-1 outline-none px-3"
                  type="text"
                  placeholder="Search surveys"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSearch}
                  className="px-3 h-full border-l border-[#d9d9d9] hover:bg-gray-50 rounded-r-lg"
                >
                  <SearchIcon className="text-[#9D50BB]" />
                </button>
              </div>
              <div className="hidden md:flex">
                <FilterButton
                  type="survey"
                  text="Add filter"
                  buttonClassName="border-[#D9D9D9]"
                  onFilterChange={handleFilterChange}
                  currentStatus={status}
                />
                {(search || status) && (
                  <ShadButton
                    variant="ghost"
                    onClick={handleReset}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-5 h-5" />
                    <span className="ml-2 text-base">Reset</span>
                  </ShadButton>
                )}
              </div>
            </div>
            <div className="hidden md:block mt-2 md:mt-0">
              <div className="hidden md:flex gap-3">
                {userRoles.includes("Admin") && (
                  <>
                    <CreateSurveyButton />
                    <ShadButton
                      onClick={() => toggleDrafts(true)}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg"
                    >
                      View Drafts
                    </ShadButton>
                  </>
                )}
              </div>
            </div>
            <div className="block md:hidden">
              <FilterButton text="Add filter" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
            {data?.data?.data?.map((item: any, index: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SurveyCard {...item} />
              </motion.div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 flex justify-end">
            <PageControl
              currentPage={currentPage}
              totalPages={totalPages}
              onNavigate={navigatePage}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedSurveysPage;
