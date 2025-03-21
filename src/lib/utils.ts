import { Test, Variable } from "@/components/analysis/AnalysisTests";
import { type ClassValue, clsx } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInitials(name: string): string {
  if (!name) return "";

  const nameParts = name.trim().split(/\s+/); // Split by spaces
  let initials = "";

  if (nameParts.length === 1) {
    // If only one name, take the first character
    initials = nameParts[0].charAt(0).toUpperCase();
  } else {
    // Take the first character of the first and last names
    initials =
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  }

  return initials;
}

export function handleAccountStatus(status: string) {
  if (status === "Pending") {
    return "Invited";
  } else if (status === "Active") {
    return "Active";
  } else {
    return "Removed";
  }
}

/**
 * Utility function to calculate the number of pages.
 *
 * @param totalItems - The total number of items.
 * @param pageSize - The number of items per page.
 * @returns The number of pages required to display all items.
 */
export function getNumberOfPages(totalItems: number, pageSize: number): number {
  if (pageSize <= 0) {
    throw new Error("Page size must be greater than 0");
  }

  return Math.ceil(totalItems / pageSize);
}

export function getUniqueVariables(tests: Test[]): Variable[] {
  const allVariables = tests.flatMap((test) => test.variables);

  // Remove duplicates by id
  const uniqueVariables = Array.from(
    new Map(allVariables.map((variable) => [variable.id, variable])).values()
  );

  return uniqueVariables;
}

export const extractMongoId = (pathname: string): string | undefined => {
  const regex = /[a-f\d]{24}/i; // MongoDB ObjectID pattern (24 hex characters)
  const match = pathname.match(regex);
  return match ? match[0] : undefined;
};

export const formatString = (input: string = ""): string => {
  // Break the input into lines and then process each one
  return input
    .replace(/(\d+)\.\s/g, "\n$1.\n\t") // Match numbered questions like 1., 2., etc. and add new lines and tabs
    .replace(/-\s/g, "\t- ") // Match list items starting with '-' and indent them
    .replace(/(Please let me know.*)/, "\n$1"); // Move any closing sentence that starts with 'Please let me know' to a new line
};

[
  "Design Survey",
  "Assign Roles",
  "Collect Data",
  "Validate Data",
  "Analyse Survey",
  "Generate Report",
  "Close Survey",
];

export const generateMilestoneStage = (stage: string): string => {
  if (stage === "Design Survey") {
    return "1";
  }
  if (stage === "Assign Roles") {
    return "2";
  }
  if (stage === "Collect Data") {
    return "3";
  }
  if (stage === "Validate Data") {
    return "4";
  }
  if (stage === "Analyse Survey") {
    return "5";
  }
  if (stage === "Generate Report") {
    return "6";
  }
  if (stage === "Close Survey") {
    return "7";
  }
  return "0";
};

export const handleApiErrors = (response: any) => {
  const message = response?.message ?? response?.data?.message;

  if (
    message?.toLowerCase().includes("not authenticated") ||
    message?.toLowerCase().includes("unauthenticated") ||
    message?.toLowerCase().includes("unauthorized")
  ) {
    // Clear any auth state/tokens
    localStorage.clear();
    // Redirect to login page
    window.location.href = "/login";
    return;
  }

  // toast.error(message);
};

export const isValidResponse = (response: any) => {
  console.log(response);
  if (response?.success || response?.data?.success) {
    return true;
  }

  return false;
};

export const getMonthsFromCurrent = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months;
};

export function getCurrentAndLastYears(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];

  for (let i = 0; i < 5; i++) {
    years.push((currentYear - i).toString());
  }

  return years.reverse();
}
