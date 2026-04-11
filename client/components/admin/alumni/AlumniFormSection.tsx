"use client";

import type { UseFormReturn } from "react-hook-form";
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
import type { AlumniFormValues } from "./formSchema";
import type { TeamMember } from "./types";

interface AlumniFormSectionProps {
  form: UseFormReturn<AlumniFormValues>;
  isSubmitting: boolean;
  editingId: string | null;
  teamMembers: TeamMember[];
  alumni: TeamMember[];
  onSubmit: (values: AlumniFormValues) => void;
}

export default function AlumniFormSection({
  form,
  isSubmitting,
  editingId,
  teamMembers,
  alumni,
  onSubmit,
}: AlumniFormSectionProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="teamMemberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-300 block">
                  Team Member <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <select
                    className="flex w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-10 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    {...field}
                    disabled={!!editingId}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!editingId) {
                        const selectedId = e.target.value;
                        const selectedMember = teamMembers.find(
                          (t) => t.id === selectedId,
                        );
                        if (selectedMember) {
                          form.setValue("role", selectedMember.role);
                        }
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select a team member
                    </option>
                    {editingId && alumni.find((a) => a.id === editingId) && (
                      <option value={editingId}>
                        {alumni.find((a) => a.id === editingId)?.name}
                      </option>
                    )}
                    {!editingId &&
                      teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </option>
                      ))}
                  </select>
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
                <FormLabel className="text-xs font-medium text-zinc-300 block">
                  Alumni Role <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Former Technical Lead"
                    className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-yellow-500 text-white text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-300 block">
                  Current Company (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Google, Amazon, Microsoft"
                    className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-yellow-500 text-white text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors font-bold text-sm w-full md:w-auto h-10"
          >
            {isSubmitting ? "Saving..." : "Save Alumni"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
