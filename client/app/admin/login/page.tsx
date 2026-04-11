"use client";

import { motion } from "framer-motion";
import { useAppDispatch } from "@/lib/store";
import { loginAdmin } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AdminLoginCard from "@/components/admin/login/AdminLoginCard";
import type { AdminLoginValues } from "@/components/admin/login/formSchema";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: AdminLoginValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };
      const resultAction = await dispatch(loginAdmin(payload)).unwrap();
      if (resultAction) {
        toast.success("Welcome back to the FOSS Admin Portal.");
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      const error = err as any;

      // Handle network errors (e.g. backend down) when authSlice explicitly passes it or when it bubbles up raw
      if (error === "Network Error" || error.message === "Network Error") {
        toast.error("Internal Server Error");
      } else {
        toast.error(
          error.message ||
            error.response?.data?.message ||
            error.error ||
            error ||
            "Invalid login credentials. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden w-full">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#08B74F]/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AdminLoginCard isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </motion.div>
    </div>
  );
}
