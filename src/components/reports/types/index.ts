export type ReportCategory = {
  _id: string;
  name: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ReportCategoryResponse = {
  success: boolean;
  message: string;
  data: ReportCategory[];
};

export type OnboardingData = {
  _id: string;
  organization_id: string;
  categories: {
    _id: string;
    name: string;
  }[];
  fields_of_interest: {
    _id: string;
    name: string;
  }[];
  accepted_terms: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type OnboardingResponse = {
  success: boolean;
  message: string;
  data: OnboardingData;
};

export type Step = "category" | "interests" | "finish";

export const stepOrder: Step[] = ["category", "interests", "finish"];
