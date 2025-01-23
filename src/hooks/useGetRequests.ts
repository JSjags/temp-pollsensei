import { handleApiErrors, isValidResponse } from "@/lib/utils";
import { queryKeys, TUTORIAL_ENUM } from "@/services/api/constants.api";
import { getTutorials } from "@/services/api/tutorial";
import { useQuery } from "@tanstack/react-query";

export interface UseGetTutorialsProps {
  filter?: TUTORIAL_ENUM;
  page?: number;
}

export const useGetTutorials = (props: UseGetTutorialsProps) => {
  const { filter, page } = props;

  console.log({ filter, page });

  return useQuery({
    queryKey: [queryKeys.TUTORIALS, filter, page],
    queryFn: async () => {
      const response = await getTutorials(props);
      if (isValidResponse(response)) {
        return response?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });
};
