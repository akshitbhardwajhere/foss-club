"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Edit3,
  Plus,
  MapPin,
  Link as LinkIcon,
  Users,
  StopCircle,
} from "lucide-react";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";
import ReleaseFormModal from "@/components/admin/ReleaseFormModal";
import ViewRegistrationsModal from "@/components/admin/ViewRegistrationsModal";
import ConfirmActionDialog from "@/components/admin/ConfirmActionDialog";
import EventFormSection from "@/components/admin/events/EventFormSection";
import {
  eventFormSchema,
  type EventFormValues,
} from "@/components/admin/events/formSchema";
import { toast } from "sonner";

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  imageUrl?: string;
  documentUrl?: string;
  registrationConfig?: any;
  isDateTentative?: boolean;
}

const TABLE_COLUMNS = ["Event Details", "Date", "Status", "Actions"];

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] =
    useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      category: "",
      date: "",
      location: "",
      description: "",
      imageUrl: "",
      documentUrl: "",
      isDateTentative: false,
    },
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events");
      setEvents(res.data);
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string, title?: string) => {
    try {
      await api.delete(`/api/events/${id}`);
      setEvents(events.filter((event) => event.id !== id));
      toast.success(`Event "${title}" deleted successfully.`);
    } catch (error) {
      toast.error("An error occurred while deleting the event.");
    }
  };

  const handleStopRegistration = async (eventId: string, title: string) => {
    try {
      await api.patch(`/api/registration/stop/${eventId}`);
      await fetchEvents();
      toast.success(`Registrations for "${title}" have been stopped.`);
    } catch (error) {
      toast.error("Failed to stop registrations. Please try again.");
    }
  };

  const handleEdit = (event: EventItem) => {
    let localDateString = "";
    if (event.date) {
      if (event.isDateTentative) {
        localDateString = event.date.slice(0, 7);
      } else {
        const d = new Date(event.date);
        localDateString = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
      }
    }
    form.reset({
      title: event.title || "",
      category: event.category || "",
      date: localDateString,
      location: event.location || "",
      description: event.description || "",
      imageUrl: event.imageUrl || "",
      documentUrl: event.documentUrl || "",
      isDateTentative: event.isDateTentative || false,
    });
    setEditingId(event.id);
    setIsCreating(true);
  };

  async function onSubmit(values: EventFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...values,
        date: new Date(values.date).toISOString(),
      };
      if (editingId) {
        await api.put(`/api/events/${editingId}`, payload);
        toast.success("Event updated successfully.");
      } else {
        await api.post("/api/events", payload);
        toast.success("New event published!");
      }
      await fetchEvents();
      setIsCreating(false);
      setEditingId(null);
      form.reset();
    } catch (err: unknown) {
      const error = err as any;
      setError(
        error.response?.data?.message || error.message || "An error occurred",
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to publish event",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <AdminPageHeader
          icon={CalendarDays}
          iconClassName="bg-blue-500/10 text-blue-400 border-blue-500/20"
          title="Manage Events"
          subtitle="View, edit, or create new upcoming events"
        />
        {!isCreating && (
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsRegistrationsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20 font-bold hover:bg-purple-600/30 transition-colors w-full md:w-auto justify-center"
            >
              <Users className="w-5 h-5" /> Registrations
            </button>
            <button
              onClick={() => setIsReleaseModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/20 font-bold hover:bg-blue-600/30 transition-colors w-full md:w-auto justify-center"
            >
              <LinkIcon className="w-5 h-5" /> Release Form
            </button>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingId(null);
                form.reset({
                  title: "",
                  category: "",
                  date: "",
                  location: "",
                  description: "",
                  imageUrl: "",
                  documentUrl: "",
                  isDateTentative: false,
                });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-colors w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" /> Create Event
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isCreating ? (
        <AdminFormWrapper
          title={editingId ? "Edit Event" : "New Event Details"}
          onCancel={cancelForm}
          error={error}
        >
          <EventFormSection
            form={form}
            isSubmitting={isSubmitting}
            editingId={editingId}
            onSubmit={onSubmit}
          />
        </AdminFormWrapper>
      ) : (
        <motion.div
          className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="overflow-x-auto min-h-75">
            {loading ? (
              <AdminTableSkeleton columns={TABLE_COLUMNS} />
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-zinc-400">
                <CalendarDays className="w-12 h-12 mb-4 text-zinc-600" />
                <p className="text-lg font-medium">No events found.</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 text-[#08B74F] hover:underline font-medium"
                >
                  Create your first event
                </button>
              </div>
            ) : (
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">Event Details</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-4 font-medium hidden sm:table-cell">
                      Status
                    </th>
                    <th className="px-6 py-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {events.map((event) => {
                    const isPast = new Date(event.date) < new Date();
                    return (
                      <tr
                        key={event.id}
                        className="hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {event.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-10 h-10 rounded bg-zinc-800 object-cover hidden sm:block"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-zinc-800 hidden sm:flex items-center justify-center">
                                <CalendarDays className="w-4 h-4 text-zinc-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white text-sm md:text-base truncate max-w-37.5 md:max-w-xs">
                                {event.title}
                              </p>
                              <p className="text-xs text-zinc-500 md:hidden">
                                {event.isDateTentative
                                  ? new Date(event.date).toLocaleDateString(
                                      "en-US",
                                      { month: "long", year: "numeric" },
                                    )
                                  : formatDate(event.date)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-sm hidden md:table-cell">
                          {event.isDateTentative
                            ? new Date(event.date).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })
                            : formatDate(event.date)}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              !isPast
                                ? "border-[#08B74F]/30 bg-[#08B74F]/10 text-[#08B74F]"
                                : "border-red-700 bg-red-500/10 text-red-500"
                            }`}
                          >
                            {isPast ? "Completed" : "Upcoming"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {event.registrationConfig &&
                              new Date(event.registrationConfig.validUntil) >
                                new Date() && (
                                <ConfirmActionDialog
                                  trigger={
                                    <button
                                      title="Stop Registrations"
                                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                                    >
                                      <StopCircle className="w-4 h-4" />
                                    </button>
                                  }
                                  title="Stop Registrations?"
                                  description={`This will immediately close the registration form for "${event.title}". No new registrations will be accepted.`}
                                  actionLabel="Stop Registrations"
                                  actionClassName="!bg-orange-600 hover:!bg-orange-700 !text-white"
                                  onConfirm={() =>
                                    handleStopRegistration(
                                      event.id,
                                      event.title,
                                    )
                                  }
                                />
                              )}
                            <button
                              onClick={() => handleEdit(event)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <ConfirmDeleteDialog
                              trigger={
                                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </button>
                              }
                              itemName={event.title}
                              onConfirm={() =>
                                handleDelete(event.id, event.title)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}

      <ReleaseFormModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        events={events}
      />
      <ViewRegistrationsModal
        isOpen={isRegistrationsModalOpen}
        onClose={() => setIsRegistrationsModalOpen(false)}
        events={events}
      />
    </div>
  );
}
