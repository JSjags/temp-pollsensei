import axiosInstance from "@/lib/axios-instance";

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
