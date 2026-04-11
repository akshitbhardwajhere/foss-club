"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Loader2,
  User,
  AtSign,
  FileText,
  Sparkles,
  Phone,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import { getStaggeredMotionPresets } from "@/lib/motion";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/components/contact/formSchema";

/**
 * ContactPage Component
 *
 * A robust client-side form using `react-hook-form` and `zod` validation that allows
 * users to apply to join the community. Captures user metadata depending on whether they are
 * from the host university or not. Handles submission explicitly via the backend `/api/contact` API.
 */
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { containerVariants, itemVariants } = getStaggeredMotionPresets({
    childStagger: 0.1,
    childDelay: 0.1,
    itemOffsetY: 20,
    itemDuration: 0.5,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      isNitSrinagar: undefined, // Let it be undefined initially for the select placeholder
      institute: "",
      enrollment: "",
      expertise: "",
    },
  });

  const isNitSrinagarValue = watch("isNitSrinagar");

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    try {
      // Map conditionally rendered fields so backend receives appropriate defaults
      const payload = { ...values };
      if (values.isNitSrinagar === "yes") {
        payload.institute = "NIT Srinagar";
      } else {
        payload.enrollment = "N/A";
      }

      await api.post("/api/contact", payload);
      toast.success("Your request has been submitted!", {
        description: "We'll get back to you soon.",
      });
      reset();
    } catch (error: any) {
      // Extract error message from response
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      toast.error("Failed to submit your request.", {
        description: backendError || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputBaseClass =
    "w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm outline-none transition-all duration-300 focus:border-[#08B74F]/60 focus:ring-2 focus:ring-[#08B74F]/10 focus:bg-zinc-900";

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center justify-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Dynamic Background Blurs */}
      <BackgroundBlur />

      <motion.div
        className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left — Contact Info */}
        <div className="flex flex-col justify-center">
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-sm font-medium w-fit"
          >
            <MessageSquare className="w-4 h-4" /> Get in Touch
          </motion.div>

          <PageHeader
            className="text-left mb-6"
            title={
              <>
                Get in{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#08B74F] to-emerald-400">
                  Touch
                </span>
              </>
            }
          />

          <motion.div
            variants={itemVariants}
            className="text-zinc-400 text-lg mb-10 max-w-md font-medium leading-relaxed"
          >
            Have a question, want to collaborate, or just want to say hi?
            We&apos;d love to hear from you.
            <div className="mt-6 p-4 rounded-xl bg-[#08B74F]/10 border border-[#08B74F]/20 text-sm">
              <p className="font-semibold text-[#A7F3D0] mb-1">
                Building the FOSS Community
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Please note that our upcoming events and workshops will be
                exclusively available to registered FOSS Community members. Fill
                out the form below to join us!
              </p>
            </div>
            <p className="text-zinc-500 mt-6 text-sm max-w-[90%]">
              Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#08B74F]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Email Us</p>
                <p className="font-medium text-lg">foss@nitsri.ac.in</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#08B74F]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Visit Us</p>
                <p className="font-medium text-lg">NIT Srinagar, Hazratbal</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right — Join Us Form */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-[#08B74F]/20 via-transparent to-[#08B74F]/5 pointer-events-none" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 space-y-6"
          >
            {/* Form Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#08B74F]" />
                Join the FOSS Community
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Fill in the details below and we&apos;ll reach out to you.
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#08B74F]" /> Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="John Doe"
                className={inputBaseClass}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <AtSign className="w-3.5 h-3.5 text-[#08B74F]" /> Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                className={inputBaseClass}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="contact-phone"
                className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#08B74F]" /> Phone Number{" "}
                <span className="text-zinc-500 font-normal ml-1">
                  (Optional)
                </span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="+91XXXXXXXXXX"
                className={inputBaseClass}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Is NIT Srinagar? */}
            <div>
              <label
                htmlFor="contact-isnitsrinagar"
                className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#08B74F]" /> Are you from
                NIT Srinagar?
              </label>
              <select
                id="contact-isnitsrinagar"
                className={`${inputBaseClass} appearance-none cursor-pointer`}
                {...register("isNitSrinagar")}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.isNitSrinagar && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.isNitSrinagar.message}
                </p>
              )}
            </div>

            {/* Institute (Conditional) */}
            {isNitSrinagarValue === "no" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <label
                  htmlFor="contact-institute"
                  className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#08B74F]" /> Institute
                  Name
                </label>
                <input
                  id="contact-institute"
                  type="text"
                  placeholder="e.g. IIT Delhi"
                  className={inputBaseClass}
                  {...register("institute")}
                />
                {errors.institute && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.institute.message}
                  </p>
                )}
              </motion.div>
            )}

            {/* Enrollment (Conditional) */}
            {isNitSrinagarValue === "yes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <label
                  htmlFor="contact-enrollment"
                  className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#08B74F]" /> Enrollment
                  Number
                </label>
                <input
                  id="contact-enrollment"
                  type="text"
                  placeholder="202XB...XXX"
                  className={inputBaseClass}
                  {...register("enrollment")}
                />
                {errors.enrollment && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.enrollment.message}
                  </p>
                )}
              </motion.div>
            )}

            {/* Expertise */}
            <div>
              <label
                htmlFor="contact-expertise"
                className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#08B74F]" /> Your
                Expertise
              </label>
              <input
                id="contact-expertise"
                type="text"
                placeholder="e.g. React, Python, DevOps, UI/UX Design..."
                className={inputBaseClass}
                {...register("expertise")}
              />
              {errors.expertise && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.expertise.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#08B74F] to-emerald-500 hover:from-[#07a346] hover:to-emerald-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#08B74F]/15 hover:shadow-[#08B74F]/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Join the FOSS Community
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
