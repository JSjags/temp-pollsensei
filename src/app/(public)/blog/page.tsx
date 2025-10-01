"use client";
import { useEffect, useState, useMemo } from "react";
import NavBar from "@/components/blocks/NavBar";
import Navbar from "@/components/navbar/Navbar";
import BlogDashboard from "@/subpages/blog/BlogDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import {
  GetAllBlogPost,
  GetBlogPostByCategory,
  GetBlogPostByInterest,
} from "@/services/api/apiRequest";

export type FilterType = "dashboard" | "category" | "interest";

const BlogPage = () => {
  const user = useSelector((state: RootState) => state.user?.user);
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterType>("dashboard");
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const defaultPage = 1;
  const defaultPageSize = 9;

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isSuccess: isDashboardSuccess,
  } = useQuery({
    queryKey: [APP_KEYS.ALL_REPORTS, defaultPage, defaultPageSize],
    queryFn: () => GetAllBlogPost(defaultPage, defaultPageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories: any = useMemo(() => {
    if (dashboardData?.data) {
      return Array.from(
        new Map(
          dashboardData.data
            .flatMap((post: any) => post.categories || [])
            .map((cat: any) => [cat._id, cat])
        ).values()
      );
    }
    return [];
  }, [dashboardData?.data]);

  const fieldsOfInterest: any = useMemo(() => {
    if (dashboardData?.data) {
      return Array.from(
        new Map(
          dashboardData.data
            .flatMap((post: any) => post.fields_of_interest || [])
            .map((interest: any) => [interest._id, interest])
        ).values()
      );
    }
    return [];
  }, [dashboardData?.data]);

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: [
      APP_KEYS.REPORTS_BY_CATEGORY,
      categories[0]?._id,
      defaultPage,
      defaultPageSize,
    ],
    queryFn: () =>
      GetBlogPostByCategory(categories[0]?._id, defaultPage, defaultPageSize),
    enabled: categories.length > 0 && activeFilter === "category",
    staleTime: 5 * 60 * 1000,
  });

  const { data: interestData, isLoading: isInterestLoading } = useQuery({
    queryKey: [
      APP_KEYS.REPORTS_BY_INTEREST,
      fieldsOfInterest[0]?._id,
      defaultPage,
      defaultPageSize,
    ],
    queryFn: () =>
      GetBlogPostByInterest(
        fieldsOfInterest[0]?._id,
        defaultPage,
        defaultPageSize
      ),
    enabled: fieldsOfInterest.length > 0 && activeFilter === "interest",
    staleTime: 5 * 60 * 1000,
  });

  // console.log({
  //   dashboardData,
  //   categories,
  //   fieldsOfInterest,
  //   categoryData,
  //   interestData,
  // });

  useEffect(() => {
    if (isDashboardSuccess && !isInitialLoadComplete) {
      setIsInitialLoadComplete(true);

      // Prefetch category and interest data if available
      if (categories.length > 0 && user?._id) {
        queryClient.prefetchQuery({
          queryKey: [
            APP_KEYS.REPORTS_BY_CATEGORY,
            categories[0]._id,
            defaultPage,
            defaultPageSize,
          ],
          queryFn: () =>
            GetBlogPostByCategory(
              categories[0]._id,
              defaultPage,
              defaultPageSize
            ),
          staleTime: 5 * 60 * 1000,
        });
      }

      if (fieldsOfInterest.length > 0 && user?._id) {
        queryClient.prefetchQuery({
          queryKey: [
            APP_KEYS.REPORTS_BY_INTEREST,
            fieldsOfInterest[0]._id,
            defaultPage,
            defaultPageSize,
          ],
          queryFn: () =>
            GetBlogPostByInterest(
              fieldsOfInterest[0]._id,
              defaultPage,
              defaultPageSize
            ),
          staleTime: 5 * 60 * 1000,
        });
      }
    }
  }, [
    isDashboardSuccess,
    isInitialLoadComplete,
    queryClient,
    user?._id,
    categories,
    fieldsOfInterest,
  ]);

  // Handle filter change
  const handleFilterChange = (newFilter: FilterType) => {
    setActiveFilter(newFilter);

    if (newFilter === "dashboard") {
      return;
    } else if (newFilter === "category" && categories.length > 0) {
      queryClient.refetchQueries({
        queryKey: [
          APP_KEYS.REPORTS_BY_CATEGORY,
          categories[0]._id,
          defaultPage,
          defaultPageSize,
        ],
      });
    } else if (newFilter === "interest" && fieldsOfInterest.length > 0) {
      queryClient.refetchQueries({
        queryKey: [
          APP_KEYS.REPORTS_BY_INTEREST,
          fieldsOfInterest[0]._id,
          defaultPage,
          defaultPageSize,
        ],
      });
    }
  };

  // Get current data based on active filter
  const getCurrentData = () => {
    switch (activeFilter) {
      case "dashboard":
        return {
          data: dashboardData,
          isLoading: isDashboardLoading,
          filterType: "dashboard" as const,
        };
      case "category":
        return {
          data: categoryData,
          isLoading: isCategoryLoading,
          filterType: "category" as const,
        };
      case "interest":
        return {
          data: interestData,
          isLoading: isInterestLoading,
          filterType: "interest" as const,
        };
      default:
        return {
          data: dashboardData,
          isLoading: isDashboardLoading,
          filterType: "dashboard" as const,
        };
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="w-full">
      {user ? (
        <Navbar
          showReportsHeader={true}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      ) : (
        <NavBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      )}
      <BlogDashboard
        activeFilter={activeFilter}
        filterData={currentData.data}
        isFilterLoading={currentData.isLoading}
        filterType={currentData.filterType}
      />
    </div>
  );
};

export default BlogPage;
