export const extractDescription = (jsonString: string): string => {
  try {
    // Remove any markdown code block syntax if present
    const cleanJson = jsonString.replace(/```json\n|\n```/g, "");

    // Parse the JSON string
    const parsed = JSON.parse(cleanJson);

    // Return the description or empty string if not found
    return parsed.description || "";
  } catch (error) {
    // If there's an error parsing, try returning the raw string
    // after basic cleanup in case it's already the description
    const cleanedString = jsonString
      .replace(/```json\n|\n```/g, "") // Remove markdown
      .replace(/^\s*{\s*"description":\s*"|"\s*}\s*$/g, "") // Remove JSON wrapper
      .trim();

    return cleanedString || "";
  }
};
