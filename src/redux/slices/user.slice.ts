// src/redux/slices/user.slice.ts
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Assuming you have a RootState type defined

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: Array<{
    organization: string;
    role: string[];
    _id: string;
  }>;
  organization_ids: string[];
  isEmailVerified: boolean;
  disabled: Array<{
    organization: string;
    status: boolean;
    _id: string;
  }>;
  status: Array<{
    organization: string;
    status: string;
    _id: string;
  }>;
  bios: Array<{
    organization: string;
    bio: string;
    _id: string;
  }>;
  is_collaborator: any[];
  plan: {
    _id: string;
    name: string;
    description: string;
    number_of_collaborators: number;
    number_of_monthly_responses: number;
    number_of_accounts: number;
    features: string[];
  };
  notifications: Array<{
    email_notification: {
      news_and_updates: boolean;
      tips_and_tutorials: boolean;
      offers_and_promotions: boolean;
    };
    more_activity: {
      all_reminders_and_activities: boolean;
      activities_only: boolean;
      important_reminder_only: boolean;
    };
    organization: string;
    _id: string;
  }>;
  invited_by: any[];
  joinedDate: any[];
  collaborator_roles: any[];
  collaborating_surveys: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  current_organization: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  access_token?: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state: UserState, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    logoutUser(state: UserState) {
      const cookieConsent = localStorage.getItem("cookieConsent");
      localStorage.clear();
      if (cookieConsent) localStorage.setItem("cookieConsent", cookieConsent);
      return {
        ...state,
        user: null,
        token: null,
      };
    },
  },
});

const selectUserState = (state: RootState) => state.user;

export const selectUserId = createSelector(
  [selectUserState],
  (userState: UserState | undefined) => userState?.user?._id ?? null
);
export const { updateUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
