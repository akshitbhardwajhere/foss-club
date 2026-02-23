"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

import { useAppDispatch } from "@/lib/store";
import { loginAdmin } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#08B74F]/10 flex items-center justify-center mb-4 text-[#08B74F]">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-center">
              Admin Portal
            </h1>
            <p className="text-zinc-400 text-center mt-2">
              Sign in to manage FOSS activities
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@fossnit.in"
                        type="email"
                        className="bg-zinc-950 border-zinc-800 focus-visible:ring-[#08B74F] h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-zinc-950 border-zinc-800 focus-visible:ring-[#08B74F] h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#08B74F] text-black hover:bg-[#08B74F]/90 text-lg font-bold h-12 rounded-xl mt-4 disabled:opacity-50"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
