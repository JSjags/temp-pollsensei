import { type ClassValue, clsx } from "clsx";
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
