import axiosInstance from "@/lib/axios-instance";
import { GetSingleTutorial, GetTutorials } from "@/types/api/tutorials.types";
import { TUTORIAL_ENUM } from "./constants.api";
import { UseGetTutorialsProps } from "@/hooks/useGetRequests";

export const getPopularTutorials = (type: "video" | "web") => {
  return axiosInstance.get<GetTutorials>(
    `/tutorial/popular?page=1&page_size=3&filter_by=${type}`
  );
};

export const getTutorials = (props: UseGetTutorialsProps) => {
  const { filter, page: pageNumber } = props;
  const page = pageNumber ?? 1;

  return axiosInstance.get<GetTutorials>(
    `/tutorial?page=${page}&page_size=100${
      filter ? `&filter_by=${filter}` : ""
    }`
  );
};

export const getSingleTutorial = (slug: string) =>
  axiosInstance.get<GetSingleTutorial>(`tutorial/${slug}`);
