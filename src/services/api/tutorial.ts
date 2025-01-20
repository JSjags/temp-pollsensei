import axiosInstance from "@/lib/axios-instance";
import { GetSingleTutorial, GetTutorials } from "@/types/api/tutorials.types";

export const getPopularTutorials = (type: "video" | "web") => {
  return axiosInstance.get<GetTutorials>(
    `/tutorial/popular?page=1&page_size=3&filter_by=${type}`
  );
};

export const getTutorials = (type?: "video" | "web") => {
  return axiosInstance.get<GetTutorials>(
    `/tutorial?page=1&page_size=100${type ? `&filter_by=${type}` : ""}`
  );
};

export const getSingleTutorial = (slug: string) =>
  axiosInstance.get<GetSingleTutorial>(`tutorial/${slug}`);
