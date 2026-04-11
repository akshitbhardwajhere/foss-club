import type { EventStatusState } from "./types";

const MONTH_NAMES = [
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
] as const;

export function buildEventStatus(date: string): EventStatusState {
  const now = new Date();
  const eventDate = new Date(date);
  const isToday = now.toDateString() === eventDate.toDateString();
  const isPast = eventDate < now && !isToday;

  return {
    isToday,
    isPast,
    isLive: isToday,
  };
}

export function formatEventDate(
  date: string,
  isDateTentative?: boolean,
): string {
  const eventDate = new Date(date);

  if (isDateTentative) {
    return `${MONTH_NAMES[eventDate.getMonth()]} ${eventDate.getFullYear()}`;
  }

  const day = eventDate.getDate().toString().padStart(2, "0");
  const month = (eventDate.getMonth() + 1).toString().padStart(2, "0");
  const year = eventDate.getFullYear();

  return `${day}/${month}/${year}`;
}
