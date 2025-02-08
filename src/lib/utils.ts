import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getStartDateForPeriod = (period: string) => {
  const currentDate = new Date();
  switch (period) {
    case "weekly":
      const startOfWeek = currentDate.getDate() - currentDate.getDay(); // Get the start of the week (Sunday)
      currentDate.setDate(startOfWeek);
      break;
    case "monthly":
      currentDate.setDate(1); // Set the date to the first day of the current month
      break;
    case "yearly":
      currentDate.setMonth(0); // Set the date to the first month (January)
      currentDate.setDate(1); // Set the day to the first day
      break;
    default:
      currentDate.setDate(1); // Default to the first day of the month if no period specified
  }
  return currentDate;
};