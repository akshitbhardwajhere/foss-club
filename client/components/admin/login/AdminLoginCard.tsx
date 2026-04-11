"use client";

import { Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { adminLoginSchema, type AdminLoginValues } from "./formSchema";

interface AdminLoginCardProps {
  isSubmitting: boolean;
  onSubmit: (values: AdminLoginValues) => void | Promise<void>;
}

export default function AdminLoginCard({
  isSubmitting,
  onSubmit,
}: AdminLoginCardProps) {
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
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
  );
}
