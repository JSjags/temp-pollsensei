interface Question {
  question: string;
  description?: string;
  question_type: string;
  is_required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  rows?: string[];
  columns?: string[];
  can_accept_media?: boolean;
}

export type { Question };

interface DocumentType {
  idDocument: any;
  // name: string;
  // type: string;
}

export interface RespondentFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  // otherName?: string;
  email: string;
  phoneNumber: string;
  gender: string;
  // otherGender?: string;
  maritalStatus: string;
  ageGroup: string;
  children: string;
  pets: string[];
  // otherPet?: string;

  // Geography & Culture
  currentLocation: string;
  // otherLocation?: string;
  region: string;
  // otherRegion?: string;
  nationality: string;
  ethnicity: string;
  // otherEthnicity?: string;
  languages: string[];
  // otherLanguage?: string;
  religion?: string;
  // otherReligion?: string;

  // Education & Employment
  educationLevel?: string;
  employmentStatus?: string;
  industry?: string;
  jobRole?: string;
  // otherJob?: string;
  workingHours?: string;
  incomeRange?: string;
  techSavvy?: string;

  //Health & Lifestyle
  overallHealth?: string;
  healthInsurance?: string;
  // otherHealthInsurance?: string;
  chronicConditions?: string;
  // otherHealthCondition?: string;
  physicalActivity?: string;
  dietaryRestrictions?: string;
  // otherDietryRestrictions?: string;
  tobaccoUse?: string;
  alcoholUse?: string;
  sleepHours?: string;

  //Technology & Media
  internetUsage?: string;
  internetAccess?: string;
  // otherPrimaryAccess?: string;
  socialMediaUsage?: string;
  contentEngagement?: string[];
  socialMediaPlatforms?: string[];
  internetBrowsers?: string[];
  // otherInternetBrowsers?: string;
  computerOS?: string;
  // computerOS?: string;
  smartphoneOS?: string;
  // otherMobileOperatingSystem?: string;
  tabletOS?: string;
  // otherTabletOperatingSystem?: string;

  //Housing & Living
  livingArrangement?: string;
  // otherLivingArrangement?: string;
  homeOwnership?: string;
  // otherHomeStatus?: string;
  householdSize?: string;

  //Mobility & Travel
  commute?: string;
  // otherCommute?: string;
  travelFrequency?: string;
  vehicleOwnership?: string;
  // otherVehicle?: string;

  //Identity Verification
  identityVerification?: DocumentType;
}

export interface FilterPaidRespondentFormData {
  // Personal Information
  gender?: string;
  ageGroup?: string;
  children?: string;
  pets?: string[];

  // Geography & Culture
  location?: string;
  region?: string;
  ethnicity?: string;

  // Education & Employment
  education_level?: string;
  employment_status?: string;
  employment_industry?: string;
  job_role?: string;
  tech_savvy?: string;

  //Health & Lifestyle
  health?: string;
  health_insurance?: string;
  health_condition?: string;

  //Technology & Media
  internet?: string;
  primary_access?: string;
  social_media?: string;
  content?: string[];
  platform?: string[];
  browser?: string[];

  //Housing & Living
  living_arrangement?: string;
  home_status?: string;
  household?: string;

  //Mobility & Travel
  commute?: string;
  travel?: string;
  vehicle?: string;
}

export interface BuyPaidRespondentResponse {
  data: SurveyData[];
  total: number;
  page: number;
  page_size: number;
}

export interface SurveyData {
  _id: string;
  topic: string;
  description?: string;
  creator: {
    _id: string;
    name: string;
    email: string;
    photo_url: string;
  };
  organization_id: {
    _id: string;
    organization_name: string;
    admin_email: string;
  };
  survey_type: string;
  questions: Question[];
  is_published: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RespondentOption {
  value: string;
  label: string;
}
