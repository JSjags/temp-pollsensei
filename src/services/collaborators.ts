import axiosInstance from "@/lib/axios-instance";

interface InviteCollaboratorPayload {
  survey_id: string;
  name: string;
  role: string[];
  email: string;
}

interface RemoveCollaboratorPayload {
  survey_id: string;
  user_id: string;
}

export const collaboratorsApi = {
  invite: async (payload: InviteCollaboratorPayload) => {
    const response = await axiosInstance.post("/survey/collaborators", payload);
    return response.data;
  },

  fetchAll: async (surveyId: string) => {
    const response = await axiosInstance.get(
      `/survey/collaborators/${surveyId}`
    );
    return response.data;
  },

  remove: async (payload: RemoveCollaboratorPayload) => {
    const response = await axiosInstance.patch(
      "/survey/collaborators",
      payload
    );
    return response.data;
  },
};
