import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface DocumentType {
  base64: string;
  name: string;
  type: string;
}

interface RespondentFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phoneNumber: string;
  gender: string;
  otherGender?: string;
  maritalStatus: string;
  ageGroup: string;
  children: string;
  pets: string[];
  otherPet?: string;

  // Geography & Culture
  location: string;
  otherLocation?: string;
  region: string;
  otherRegion?: string;
  nationality: string;
  ethnicity: string;
  otherEthnicity?: string;
  languages: string[];
  otherLanguage?: string;
  religion?: string;
  otherReligion?: string;

  // Education & Employment
  education_level?: string;
  employment_status?: string;
  employment_industry?: string;
  job_role?: string;
  otherJob?: string;
  working_hours?: string;
  income_range?: string;
  tech_savvy?: string;

  //Health & Lifestyle
  health?: string;
  health_insurance?: string;
  otherHealthInsurance?: string;
  health_condition?: string;
  otherHealthCondition?: string;
  physical_activity?: string;
  dietry_restrictions?: string;
  otherDietryRestrictions?: string;
  smoke?: string;
  drink_alcohol?: string;
  hours_sleep?: string;

  //Technology & Media
  internet?: string;
  primary_access?: string;
  otherPrimaryAccess?: string;
  social_media?: string;
  content?: string[];
  platform?: string[];
  browser?: string[];
  otherBrowser?: string;
  pc_operating_system?: string;
  otherPcOperatingSystem?: string;
  mobile_operating_system?: string;
  otherMobileOperatingSystem?: string;
  tablet_operating_system?: string;
  otherTabletOperatingSystem?: string;

  //Housing & Living
  living_arrangement?: string;
  otherLivingArrangement?: string;
  home_status?: string;
  otherHomeStatus?: string;
  household?: string;

  //Mobility & Travel
  commute?: string;
  otherCommute?: string;
  travel?: string;
  vehicle?: string;
  otherVehicle?: string;

  //Identity Verification
  documents?: DocumentType[];
}

export function useSubmitRespondentForm() {
  const pollsenseiAPIKey = `${process.env.NEXT_PUBLIC_APP_TOKEN}`;
  const pollsenseiAPIEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}`;

  return useMutation({
    mutationFn: async ({
      tab,
      formData,
    }: {
      tab: string;
      formData: Partial<RespondentFormData>;
    }) => {
      const url = `${pollsenseiAPIEndpoint}paid-respondent`;

      try {
        const response = await axios.post(url, formData, {
          params: {
            section: tab,
          },
          headers: {
            Authorization: `Bearer ${pollsenseiAPIKey}`,
            "Content-Type": "application/json",
          },
        });
        // console.log("API Response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Request failed:", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message || "Failed to submit form data"
        );
      }
    },
  });
}
