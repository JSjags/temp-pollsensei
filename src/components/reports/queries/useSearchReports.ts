import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

export const useSearchReports = (
  searchTerm: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ['searchReports', searchTerm, page, pageSize],
    queryFn: async () => {
      // Don't make API call if no search term
      if (!searchTerm.trim()) {
        return { data: [], total: 0 };
      }

      const response = await axiosInstance.get('/report/search', {
        params: {
          search_term: searchTerm,
          page,
          page_size: pageSize,
        },
      });
      return response.data;
    },
    enabled: !!searchTerm.trim(), // Only enable when search term exists
  });
};