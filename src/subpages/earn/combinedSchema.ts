import { z } from "zod";
import {
  personalInformationSchema,
  geographyAndCultureSchema,
  educationAndEmploymentSchema,
  healthAndLifestyleSchema,
  techAndMediaSchema,
  housingAndLivingSchema,
  mobilityAndTravelSchema,
} from "@/utils/shema";

export const combinedSchema = personalInformationSchema
  .merge(geographyAndCultureSchema)
  .merge(educationAndEmploymentSchema)
  .merge(healthAndLifestyleSchema)
  .merge(techAndMediaSchema)
  .merge(housingAndLivingSchema)
  .merge(mobilityAndTravelSchema);

export type CombinedFormData = z.infer<typeof combinedSchema>;
