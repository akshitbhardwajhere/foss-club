import type { NextEvent, TimeLeft } from "./types";

export function buildRegistrationLink(event: NextEvent): string {
  const eventNameForUrl = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `/events/registration/${eventNameForUrl}?id=${event.id}`;
}

export function isEventLive(date: string): boolean {
  return new Date(date).toDateString() === new Date().toDateString();
}

export function getTimeLeft(date: string): TimeLeft | null {
  const difference = +new Date(date) - +new Date();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}
