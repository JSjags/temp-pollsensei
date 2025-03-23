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

export const personalInformationSchema = z.object({
  firstName: z.string().min(3, "First Name is required"),
  lastName: z.string().min(3, "Last Name is required"),
  otherName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  gender: z.string().min(1, "Gender is required"),
  otherGender: z.string().optional(),
  maritalStatus: z.string().min(1, "Marital status is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  dependents: z.string().min(1, "Dependents field is required"),
  pets: z.array(z.string()).min(1, "At least one pet is required"),
  otherPet: z.string().optional(),
});

export const geographyAndCultureSchema = z.object({
  location: z.string().min(1, "Location is required"),
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
  education_level: z.string().optional(),
  employment_status: z.string().optional(),
  employment_industry: z.string().optional(),
  job_role: z.string().optional(),
  otherJob: z.string().optional(),
  working_hours: z.string().optional(),
  income_range: z.string().optional(),
  tech_savvy: z.string().optional(),
});

export const healthAndLifestyleSchema = z.object({
  health: z.string().optional(),
  health_insurance: z.string().optional(),
  otherHealthInsurance: z.string().optional(),
  health_condition: z.string().optional(),
  otherHealthCondition: z.string().optional(),
  physical_activity: z.string().optional(),
  dietry_restrictions: z.string().optional(),
  otherDietryRestrictions: z.string().optional(),
  smoke: z.string().optional(),
  drink_alcohol: z.string().optional(),
  hours_sleep: z.string().optional(),
});

export const techAndMediaSchema = z.object({
  internet: z.string().optional(),
  primary_access: z.string().optional(),
  otherPrimaryAccess: z.string().optional(),
  social_media: z.string().optional(),
  content: z.array(z.string()).optional(),
  platform: z.array(z.string()).optional(),
  browser: z.array(z.string()).optional(),
  otherBrowser: z.string().optional(),
  pc_operating_system: z.string().optional(),
  otherPcOperatingSystem: z.string().optional(),
  mobile_operating_system: z.string().optional(),
  otherMobileOperatingSystem: z.string().optional(),
  tablet_operating_system: z.string().optional(),
  otherTabletOperatingSystem: z.string().optional(),
});

export const housingAndLivingSchema = z.object({
  living_arrangement: z.string().optional(),
  otherLivingArrangement: z.string().optional(),
  home_status: z.string().optional(),
  otherHomeStatus: z.string().optional(),
  household: z.string().optional(),
});

export const mobilityAndTravelSchema = z.object({
  commute: z.string().optional(),
  otherCommute: z.string().optional(),
  travel: z.string().optional(),
  vehicle: z.string().optional(),
});
