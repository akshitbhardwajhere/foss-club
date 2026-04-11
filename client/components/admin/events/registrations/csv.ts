import { formatDate } from "@/lib/utils";
import type { Registrant } from "./types";

export function exportRegistrationsCsv(
  eventTitle: string,
  registrations: Registrant[],
) {
  if (registrations.length === 0) {
    return;
  }

  const headers = [
    "Name",
    "Email",
    "Institute",
    "Enrollment No",
    "Branch",
    "Participation",
    "Team Name",
    "Team Members",
    "Area of Interest",
    "Registered At",
  ];

  const rows = registrations.map((registrant) => [
    `"${registrant.name}"`,
    `"${registrant.email}"`,
    `"${registrant.institute}"`,
    `"${registrant.enrollmentNo || ""}"`,
    `"${registrant.branch}"`,
    `"${registrant.isIndividual ? "Individual" : "Team"}"`,
    `"${registrant.teamName || ""}"`,
    `"${registrant.teamMembers.join(", ") || ""}"`,
    `"${registrant.areaOfInterest}"`,
    `"${formatDate(registrant.createdAt)}"`,
  ]);

  const csvData = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n",
  );
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Registrations.csv`;
  anchor.click();

  window.URL.revokeObjectURL(url);
}
