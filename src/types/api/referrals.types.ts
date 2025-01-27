import { GenericApiResponse, GenericPaginatedResponse } from ".";

export interface IReferrer {
  _id: string;
  name: string;
  email: string;
  referral_code: string;
  referrer_count: number;
  is_deleted: false;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type GetReferrers = GenericPaginatedResponse<IReferrer> &
  GenericApiResponse;

export type GetSingleReferrer = GenericApiResponse & IReferrer;

export interface PostReferrer {
  name: string;
  email: string;
}

export type GetReferrerUsers = GenericPaginatedResponse<User> &
  GenericApiResponse;

interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
  roles: Role[];
  organization_ids: string[];
  verificationToken: string;
  isEmailVerified: boolean;
  disabled: OrganizationStatus[];
  status: OrganizationStatus[];
  bios: OrganizationBio[];
  resetCode: ResetCode;
  is_collaborator: any[]; // Assuming it's an array of unknown objects
  notifications: Notification[];
  referrer: string;
  invited_by: any[]; // Assuming it's an array of unknown objects
  joinedDate: any[]; // Assuming it's an array of unknown objects
  collaborator_roles: any[]; // Assuming it's an array of unknown objects
  collaborating_surveys: any[]; // Assuming it's an array of unknown objects
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

interface Role {
  organization: string;
  role: string[];
  _id: string;
}

interface OrganizationStatus {
  organization: string;
  status: boolean | string; // Could be "Active" or a boolean
  _id: string;
}

interface OrganizationBio {
  organization: string;
  bio: string;
  _id: string;
}

interface ResetCode {
  created: string; // ISO date string
}

interface Notification {
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
}
