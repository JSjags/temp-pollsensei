import { fetchSearchReports } from "@/services/api/getCategory";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSearchReports = (searchTerm: string, page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["searchReports", searchTerm, page, pageSize],
    queryFn: () => fetchSearchReports(searchTerm, page,),
    enabled: !!searchTerm, 
    placeholderData: keepPreviousData
  });
};