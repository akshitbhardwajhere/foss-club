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
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  reason: z
    .string()
    .min(10, { message: "Please tell us more (at least 10 characters)." }),
  expertise: z
    .string()
    .min(2, { message: "Expertise must be at least 2 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      reason: "",
      expertise: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      await api.post("/api/contact", values);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400">
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
            <p className="text-zinc-500 mt-2 text-sm max-w-[90%]">
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
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#08B74F]/20 via-transparent to-[#08B74F]/5 pointer-events-none" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 space-y-6"
          >
            {/* Form Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#08B74F]" />
                Join the FOSS Club
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

            {/* Reason to Join */}
            <div>
              <label
                htmlFor="contact-reason"
                className="text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#08B74F]" /> Why do you
                want to join?
              </label>
              <textarea
                id="contact-reason"
                rows={3}
                placeholder="Tell us what excites you about open-source..."
                className={`${inputBaseClass} resize-none`}
                {...register("reason")}
              />
              {errors.reason && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.reason.message}
                </p>
              )}
            </div>

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
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#08B74F] to-emerald-500 hover:from-[#07a346] hover:to-emerald-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#08B74F]/15 hover:shadow-[#08B74F]/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
