"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import type { UseFormReturn } from "react-hook-form";
import type { TeamFormValues } from "./formSchema";
import { TEAM_ROLES } from "./formSchema";

interface TeamMemberFormSectionProps {
  form: UseFormReturn<TeamFormValues>;
  isSubmitting: boolean;
  editingId: string | null;
  onSubmit: (values: TeamFormValues) => void;
}

export default function TeamMemberFormSection({
  form,
  isSubmitting,
  editingId,
  onSubmit,
}: TeamMemberFormSectionProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1">
                      <FormLabel className="text-xs font-medium text-zinc-300 block">
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Min 2 chars
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-300">
                      Club Role <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group/select">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover/select:text-[#08B74F]/70 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                          </svg>
                        </div>
                        <select
                          className="flex w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-10 pl-9 pr-9 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 focus:border-[#08B74F]/40 focus:shadow-[0_0_12px_-3px_rgba(8,183,79,0.3)] appearance-none cursor-pointer transition-all duration-200 hover:border-[#08B74F]/30 hover:bg-[#111e16] shadow-inner shadow-black/20"
                          {...field}
                        >
                          <option
                            value=""
                            disabled
                            className="bg-zinc-900 text-zinc-500"
                          >
                            Select a role
                          </option>
                          {TEAM_ROLES.map((role) => (
                            <option
                              key={role}
                              value={role}
                              className="bg-zinc-900 text-white"
                            >
                              {role}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover/select:text-[#08B74F]/70 transition-colors"
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3">
              <h3 className="text-xs font-bold text-zinc-300 border-b border-zinc-800 pb-2">
                Social Profiles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="GitHub URL"
                          className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="LinkedIn URL"
                          className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Twitter / X URL"
                          className="bg-[#0b1410] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">
                    Profile Avatar
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url)}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Square ratio works best.
                  </p>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-[#08B74F] text-black hover:bg-[#08B74F]/90 transition-colors font-bold text-sm w-full md:w-auto h-10"
          >
            {isSubmitting
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
                ? "Update Member"
                : "Add Member"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
