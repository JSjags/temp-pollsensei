import axiosInstance from "@/lib/axios-instance";
import {
  GenericApiResponse,
  GenericPaginatedRequest,
  GenericTypeWithId,
} from "@/types/api";
import { DEFAULT_API_PAGE_SIZE } from "./tutorial";
import {
  GetReferrers,
  GetReferrerUsers,
  GetSingleReferrer,
  PostReferrer,
} from "@/types/api/referrals.types";

export const postReferrer = (data: PostReferrer) =>
  axiosInstance.post<GenericApiResponse>("/superadmin/referrer", data);

export const getReferrers = ({ pageNumber }: GenericPaginatedRequest) =>
  axiosInstance.get<GetReferrers>(
    `/superadmin/referrer?page=${pageNumber ?? 1}&page_size=${20}`
  );

export const getReferrerByIdOrCode = (value: string) =>
  axiosInstance.get<GetSingleReferrer>(`/superadmin/referrer/${value}`);

export const patchReferrer = (data: GenericTypeWithId<Partial<PostReferrer>>) =>
  axiosInstance.patch<GenericApiResponse>(
    `/superadmin/referrer/${data?.id}`,
    data?.value
  );

export const deleteReferrer = (id: string) =>
  axiosInstance.delete<GenericApiResponse>(`/superadmin/referrer/${id}`);

interface GetReferrerUsersProps extends GenericPaginatedRequest {
  id: string;
}

export const getReferrerUsers = ({ pageNumber, id }: GetReferrerUsersProps) =>
  axiosInstance.get<GetReferrerUsers>(
    `/superadmin/referrer/${id}/users?page=${pageNumber ?? 1}&page_size=${20}`
  );
