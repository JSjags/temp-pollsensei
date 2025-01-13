import axiosInstance from "@/lib/axios-instance";

export const getMeQuery = async () => {
  return axiosInstance.get(`/user/me`);
};

export const getResponseRate = async (period: "year" | "month" | "week") => {
  return axiosInstance.get(`/dashboard/surveys/response-rate?period=${period}`);
};

export const getPasswordResetCode = async () => {
  return axiosInstance.get(`/user/password-reset-code`);
};

export const getTeamMembers = async ({
  page = 1,
  page_size = 10,
  query,
  filter,
}: {
  page?: number;
  page_size?: number;
  query?: string;
  filter?: string;
}) => {
  console.log(query);

  const { data } = await axiosInstance.get(
    `/team/members?page=${page}&page_size=${page_size}${
      query && `&query=${query}`
    }${filter && `&role=${filter}`}`
  );
  return data;
};

export const editTeamMember = async ({
  name,
  email,
  role,
  memberId,
}: {
  name: string;
  email: string;
  role: string[];
  memberId: string;
}) => {
  const { data } = await axiosInstance.patch(`/team/members/${memberId}`, {
    name,
    email,
    role,
  });
  return data;
};

export const removeMember = async (id: string) => {
  const { data } = await axiosInstance.delete(`/team/members/${id}`);
  return data;
};

export const changePassword = async (data: {
  code: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return await axiosInstance.patch(`/user/update-password`, data);
};

export const updateNotification = async (data: {
  news_and_updates: boolean;
  tips_and_tutorials: boolean;
  offers_and_promotions: boolean;
  all_reminders_and_activities: boolean;
  activities_only: boolean;
  important_reminder_only: boolean;
}) => {
  return await axiosInstance.patch(`/user/notification`, data);
};

export const getSubscriptionTiers = async () => {
  const { data } = await axiosInstance.get(`/plan`);
  return data;
};

export const getSubscriptionTier = async (id: string) => {
  const { data } = await axiosInstance.get(`/plan/${id}`);
  return data;
};

export const initPaymentQuery = async (payload: {
  gateway: string;
  plan_id: string;
  organization_id: string;
  redirect_url?: string;
  plan_type: string;
  country: string;
}) => {
  const { data } = await axiosInstance.post(`/subscription/init-payment`, {
    ...payload,
  });
  return data;
};

export const cancelSubscription = async () => {
  const { data } = await axiosInstance.post(`/subscription/cancel`);
  return data;
};
