"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import RegistrationsHeader from "@/components/admin/events/registrations/RegistrationsHeader";
import RegistrationsTable from "@/components/admin/events/registrations/RegistrationsTable";
import { exportRegistrationsCsv } from "@/components/admin/events/registrations/csv";
import type { Registrant } from "@/components/admin/events/registrations/types";

export default function RegistrationsDashboard() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState("");
  const [registrations, setRegistrations] = useState<Registrant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get(`/api/registration/list/${eventId}`);
        setEventTitle(res.data.eventTitle);
        setRegistrations(res.data.registrations);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchRegistrations();
  }, [eventId]);

  const downloadCSV = () => {
    exportRegistrationsCsv(eventTitle, registrations);
  };

  const getRecipientEmails = () =>
    Array.from(
      new Set(
        registrations
          .map((registrant) => registrant.email.trim())
          .filter((email) => email.length > 0),
      ),
    );

  const emailAllRegistrants = () => {
    const recipients = getRecipientEmails();

    if (recipients.length === 0) {
      return;
    }

    const gmailComposeUrl = new URL("https://mail.google.com/mail/");
    gmailComposeUrl.searchParams.set("view", "cm");
    gmailComposeUrl.searchParams.set("fs", "1");
    gmailComposeUrl.searchParams.set("tf", "cm");
    gmailComposeUrl.searchParams.set("to", recipients.join(","));
    gmailComposeUrl.searchParams.set(
      "su",
      eventTitle
        ? `About ${eventTitle} registrations`
        : "About event registrations",
    );

    window.open(gmailComposeUrl.toString(), "_blank", "noopener,noreferrer");
  };

  const copyAllEmails = async () => {
    const recipients = getRecipientEmails();

    if (recipients.length === 0) {
      return;
    }

    try {
      await navigator.clipboard.writeText(recipients.join(", "));
      toast.success("All emails copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy emails", error);
      toast.error("Failed to copy emails. Please try again.");
    }
  };

  const filteredRegs = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.institute.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#050B08] p-4 md:p-8 pt-24 md:pt-32 w-full max-w-8xl mx-auto selection:bg-[#08B74F]/30 text-white">
      <RegistrationsHeader
        eventTitle={eventTitle}
        totalRegistrations={registrations.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={() => router.back()}
        onExportCsv={downloadCSV}
        onEmailAll={emailAllRegistrants}
        onCopyAllEmails={copyAllEmails}
        canEmailAll={registrations.length > 0}
      />

      <RegistrationsTable
        loading={loading}
        registrations={filteredRegs}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
      />
    </div>
  );
}
