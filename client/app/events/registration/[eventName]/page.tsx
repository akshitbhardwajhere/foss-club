"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link as LinkIcon,
  Building2,
  User,
  Users,
  BookOpen,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  eventRegistrationSchema,
  type EventRegistrationValues,
} from "@/components/events/registration/formSchema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function EventRegistrationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventNameSlug = params.eventName as string;
  const eventId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<EventRegistrationValues>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      institute: "",
      enrollmentNo: "",
      branch: "",
      isIndividual: "",
      teamName: "",
      teamMembers: "",
      areaOfInterest: "",
    },
  });

  const isIndividualWatch = form.watch("isIndividual");

  useEffect(() => {
    const fetchConfig = async () => {
      if (!eventId) {
        setError("Invalid registration link. Event ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/registration/config/${eventId}`);
        setConfig(res.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Registration closed or not found.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [eventId]);

  const onSubmit = async (values: EventRegistrationValues) => {
    setIsSubmitting(true);
    try {
      // Parse team members string into an array, split by comma, max 5
      const teamMembersArray = values.teamMembers
        ? values.teamMembers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 5)
        : [];

      const payload = {
        eventId,
        name: values.name,
        email: values.email,
        institute: values.institute,
        enrollmentNo: values.enrollmentNo,
        branch: values.branch,
        isIndividual: values.isIndividual === "true",
        teamName: values.teamName,
        teamMembers: teamMembersArray,
        areaOfInterest: values.areaOfInterest,
      };

      await api.post("/api/registration/submit", payload);
      setSuccess(true);
      toast.success("Registration successful!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B08] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#08B74F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-[#050B08] flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-white">
            Registration Unavailable
          </h1>
          <p className="text-zinc-400 text-sm">
            {error || "This form is no longer active."}
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050B08] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-xl shadow-[#08B74F]/5"
        >
          <div className="w-16 h-16 bg-[#08B74F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#08B74F]" />
          </div>
          <h1 className="text-2xl font-bold text-white">You're In!</h1>
          <p className="text-zinc-400 text-sm">
            Thank you for registering for {config.event.title}. We've received
            your details.
          </p>
          <div className="pt-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#08B74F] hover:underline text-sm font-medium"
            >
              Return to Homepage <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  const isClosed = new Date() > new Date(config.validUntil);

  if (isClosed) {
    return (
      <div className="min-h-screen bg-[#050B08] flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
          <h1 className="text-xl font-bold text-white">Registration Closed</h1>
          <p className="text-zinc-400 text-sm">
            The deadline to register for this event has passed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[#08B74F]/10 blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-3xl z-10">
        <div className="mb-8 text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#08B74F]/10 border border-[#08B74F]/20 text-[#08B74F] text-sm font-medium mb-4"
          >
            Registration Open
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Registration Form for {config.event.title}
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Fill out the details below to secure your spot.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                  <User className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Personal Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-zinc-300">
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="bg-[#111e16] border-[#1b3123] h-11 focus-visible:ring-[#08B74F] text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-zinc-300">
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="bg-[#111e16] border-[#1b3123] h-11 focus-visible:ring-[#08B74F] text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Academic Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                  <Building2 className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Academic Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="institute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-zinc-300">
                          Institute Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NIT Srinagar"
                            className="bg-[#111e16] border-[#1b3123] h-11 focus-visible:ring-[#08B74F] text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-zinc-300">
                          Branch / Major <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Computer Science"
                            className="bg-[#111e16] border-[#1b3123] h-11 focus-visible:ring-[#08B74F] text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enrollmentNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-zinc-300">
                          Enrollment No.{" "}
                          <span className="text-zinc-500 font-normal">
                            (if NIT Student)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 2023BMEXXX"
                            className="bg-[#111e16] border-[#1b3123] h-11 focus-visible:ring-[#08B74F] text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areaOfInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-zinc-300">
                          Area of Interest{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative group/select">
                            <select
                              className="w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-11 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 appearance-none cursor-pointer"
                              {...field}
                            >
                              <option
                                value=""
                                disabled
                                className="bg-zinc-900 text-zinc-500"
                              >
                                Select area of interest
                              </option>
                              <option
                                value="Web Development"
                                className="bg-zinc-900"
                              >
                                Web Development
                              </option>
                              <option
                                value="App Development"
                                className="bg-zinc-900"
                              >
                                App Development
                              </option>
                              <option
                                value="Artificial Intelligence / ML"
                                className="bg-zinc-900"
                              >
                                Artificial Intelligence / ML
                              </option>
                              <option
                                value="Cybersecurity"
                                className="bg-zinc-900"
                              >
                                Cybersecurity
                              </option>
                              <option
                                value="UI/UX Design"
                                className="bg-zinc-900"
                              >
                                UI/UX Design
                              </option>
                              <option
                                value="Cloud Computing"
                                className="bg-zinc-900"
                              >
                                Cloud Computing
                              </option>
                              <option value="Other" className="bg-zinc-900">
                                Other
                              </option>
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Team Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                  <Users className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Participation Type
                  </h2>
                </div>

                <FormField
                  control={form.control}
                  name="isIndividual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-zinc-300">
                        Are you participating as an individual or a team?{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative group/select w-full md:w-1/2">
                          <select
                            className="w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-11 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 appearance-none cursor-pointer"
                            {...field}
                          >
                            <option
                              value=""
                              disabled
                              className="bg-zinc-900 text-zinc-500"
                            >
                              Select option
                            </option>
                            <option value="true" className="bg-zinc-900">
                              Individual
                            </option>
                            <option value="false" className="bg-zinc-900">
                              Team (Up to 5 members)
                            </option>
                          </select>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AnimatePresence>
                  {isIndividualWatch === "false" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 overflow-hidden"
                    >
                      <FormField
                        control={form.control}
                        name="teamName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-zinc-300">
                              Team Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Byte Busters"
                                className="bg-[#111e16] border-[#1b3123] h-11 focus-visible:ring-[#08B74F] text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teamMembers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-zinc-300">
                              Team Members Names{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Comma separated (Max 5)"
                                className="bg-[#111e16] border-[#1b3123] h-11 focus-visible:ring-[#08B74F] text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 h-12 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-all text-base"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
                <p className="text-xs text-zinc-500 mt-4 text-center md:text-left">
                  By registering, you agree to the FOSS Club's code of conduct.
                </p>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
