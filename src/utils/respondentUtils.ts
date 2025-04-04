import { z } from "zod";

export function getInitialValuesFromSchema<T extends z.ZodSchema<any>>(
  schema: T
): z.infer<T> {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const initialValues: any = {};

    for (const key in shape) {
      const fieldSchema = shape[key];
      if (fieldSchema instanceof z.ZodString) {
        initialValues[key] = "";
      } else if (fieldSchema instanceof z.ZodArray) {
        initialValues[key] = [];
      } else if (fieldSchema instanceof z.ZodOptional) {
        initialValues[key] = undefined;
      } else {
        initialValues[key] = "";
      }
    }

    return initialValues as z.infer<T>;
  } else {
    throw new Error("Schema must be an object schema");
  }
}
