import Joi from "joi";
import { z } from "zod";

export const joiSchemas = {
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: false,
    })
    .max(255)
    .required()
    .label("Email"),

  password: Joi.string().min(8).max(255).required(),

  strictPassword: Joi.string()
    .min(8)
    .max(255)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
      "any.required": "Password is required.",
    }),

  name: Joi.string().min(3).max(255).required(),

  phone: Joi.string().min(11).max(14).required(),
};

{
  /***** BECOME A PAID RESPONDENTS *****/
}
export const personalInformationSchema = z.object({
  firstName: z.string().min(3, "First Name is required"),
  lastName: z.string().min(3, "Last Name is required"),
  otherName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  gender: z.string().min(1, "Gender is required"),
  otherGender: z.string().optional(),
  maritalStatus: z.string().min(1, "Marital status is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  children: z.string().min(1, "Children/Dependents field is required"),
  pets: z.array(z.string()).min(1, "At least one pet is required"),
  otherPet: z.string().optional(),
});

export const geographyAndCultureSchema = z.object({
  currentLocation: z.string().min(1, "Location is required"),
  otherLocation: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  otherRegion: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  ethnicity: z.string().min(1, "Ethnicity field is required"),
  otherEthnicity: z.string().optional(),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  otherLanguage: z.string().optional(),
  religion: z.string().optional(),
  otherReligion: z.string().optional(),
});

export const educationAndEmploymentSchema = z.object({
  educationLevel: z.string().optional(),
  employmentStatus: z.string().optional(),
  industry: z.string().optional(),
  otherIndustry: z.string().optional(),
  jobRole: z.string().optional(),
  otherJobRole: z.string().optional(),
  workingHours: z.string().optional(),
  incomeRange: z.string().optional(),
  techSavvy: z.string().optional(),
});

export const healthAndLifestyleSchema = z.object({
  overallHealth: z.string().optional(),
  healthInsurance: z.string().optional(),
  otherHealthInsurance: z.string().optional(),
  chronicConditions: z.string().optional(),
  otherHealthCondition: z.string().optional(),
  physicalActivity: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  otherDietryRestrictions: z.string().optional(),
  tobaccoUse: z.string().optional(),
  alcoholUse: z.string().optional(),
  sleepHours: z.string().optional(),
});

export const techAndMediaSchema = z.object({
  internetUsage: z.string().optional(),
  internetAccess: z.string().optional(),
  otherInternetAccess: z.string().optional(),
  socialMediaUsage: z.string().optional(),
  contentEngagement: z.array(z.string()).optional(),
  socialMediaPlatforms: z.array(z.string()).optional(),
  internetBrowsers: z.array(z.string()).optional(),
  otherInternetBrowsers: z.string().optional(),
  computerOS: z.string().optional(),
  otherComputerOS: z.string().optional(),
  smartphoneOS: z.string().optional(),
  otherSmartphoneOS: z.string().optional(),
  tabletOS: z.string().optional(),
  otherTabletOS: z.string().optional(),
});

export const housingAndLivingSchema = z.object({
  livingArrangement: z.string().optional(),
  otherLivingArrangement: z.string().optional(),
  homeOwnership: z.string().optional(),
  otherHomeOwnership: z.string().optional(),
  householdSize: z.string().optional(),
});

export const mobilityAndTravelSchema = z.object({
  commute: z.string().optional(),
  otherCommute: z.string().optional(),
  travelFrequency: z.string().optional(),
  vehicleOwnership: z.string().optional(),
});

{
  /***** BUY A PAID RESPONDENTS *****/
}

export const filterPersonalInformationSchema = z.object({
  gender: z.array(z.string()).optional(),
  maritalStatus: z.array(z.string()).optional(),
  ageGroup: z.array(z.string()).optional(),
  children: z.array(z.string()).optional(),
  pets: z.array(z.string()).optional(),
});

export const filterGeographyAndCultureSchema = z.object({
  location: z.array(z.string()).optional(),
  region: z.array(z.string()).optional(),
  ethnicity: z.array(z.string()).optional(),
});

export const filterEducationAndEmploymentSchema = z.object({
  education_level: z.array(z.string()).optional(),
  employment_status: z.array(z.string()).optional(),
  employment_industry: z.array(z.string()).optional(),
  job_role: z.array(z.string()).optional(),
  tech_savvy: z.array(z.string()).optional(),
});

export const filterHealthAndLifestyleSchema = z.object({
  health: z.array(z.string()).optional(),
  health_insurance: z.array(z.string()).optional(),
  health_condition: z.array(z.string()).optional(),
});

export const filterTechAndMediaSchema = z.object({
  internet: z.array(z.string()).optional(),
  primary_access: z.array(z.string()).optional(),
  social_media: z.array(z.string()).optional(),
  content: z.array(z.string()).optional(),
  platform: z.array(z.string()).optional(),
  browser: z.array(z.string()).optional(),
});

export const filterHousingAndLivingSchema = z.object({
  living_condition: z.array(z.string()).optional(),
  living_arrangement: z.array(z.string()).optional(),
  household: z.array(z.string()).optional(),
});

export const filterMobilityAndTravelSchema = z.object({
  commute: z.array(z.string()).optional(),
  travel: z.array(z.string()).optional(),
  vehicle: z.array(z.string()).optional(),
});

export const surveySchema = z.object({
  survey: z.string().min(1, "Select a survey type"),
  respondentsNumber: z.number().min(1, "Specify the number of respondents"),
});

export const quickSurveySchema = z.object({
  survey: z.string().min(1, "Please select a survey"),
  respondentsNumber: z
    .number()
    .min(1, "Number of respondents must be at least 1"),
  duration: z.string().min(1, "Please select a duration"),
  conditions: z
    .object({
      durationElapsed: z.boolean(),
      respondentsNumberMet: z.boolean(),
    })
    .refine((data) => data.durationElapsed || data.respondentsNumberMet, {
      message: "At least one condition must be selected",
      path: ["conditions"],
    }),
});
