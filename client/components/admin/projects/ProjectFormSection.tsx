"use client";

import { useState, useEffect } from "react";
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
import ImageUpload from "@/components/ImageUpload";
import api from "@/lib/axios";
import type { ProjectFormValues } from "./projectFormSchema";
import { Image, Video, Globe, Github, User, FileText, Check } from "lucide-react";

interface ProjectFormSectionProps {
  form: UseFormReturn<ProjectFormValues>;
  isSubmitting: boolean;
  editingId: string | null;
  onSubmit: (values: ProjectFormValues) => void;
}

interface TeamMemberOption {
  id: string;
  name: string;
  role?: string;
}

export default function ProjectFormSection({
  form,
  isSubmitting,
  editingId,
  onSubmit,
}: ProjectFormSectionProps) {
  const mediaType = form.watch("mediaType");
  const previewUrl = form.watch("previewUrl");

  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const [teamRes, alumniRes] = await Promise.allSettled([
          api.get("/api/team"),
          api.get("/api/alumni"),
        ]);

        const membersList: TeamMemberOption[] = [];

        if (teamRes.status === "fulfilled" && Array.isArray(teamRes.value.data)) {
          teamRes.value.data.forEach((m: any) => {
            membersList.push({
              id: m.id,
              name: m.name,
              role: m.role || "Core Team",
            });
          });
        }

        if (alumniRes.status === "fulfilled" && Array.isArray(alumniRes.value.data)) {
          alumniRes.value.data.forEach((m: any) => {
            if (!membersList.some((existing) => existing.name === m.name)) {
              membersList.push({
                id: m.id,
                name: m.name,
                role: m.company ? `Alumni (${m.company})` : "Alumni",
              });
            }
          });
        }

        setTeamMembers(membersList);
      } catch (err) {
        console.error("Error loading team members for select dropdown:", err);
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Essential Details */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300">
                    Project Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. FOSS Club Portal or Linux Kernel Module"
                      className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Developed By Select Field (Built like Alumni Form) */}
            <FormField
              control={form.control}
              name="developedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 block">
                    Developed By <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      className="flex w-full rounded-lg bg-[#0d1a12] border border-[#1b3123] h-10 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 cursor-pointer transition-all hover:bg-[#111e16]"
                      {...field}
                    >
                      <option value="" disabled>
                        Select a team member
                      </option>
                      {teamMembers.map((member) => (
                        <option
                          key={member.id}
                          value={member.name}
                          className="bg-zinc-900 text-white"
                        >
                          {member.name} ({member.role})
                        </option>
                      ))}
                      {field.value &&
                        !teamMembers.some((m) => m.name === field.value) && (
                          <option value={field.value} className="bg-zinc-900 text-white">
                            {field.value}
                          </option>
                        )}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#08B74F]" />
                    Live Project / Demo URL <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://myproject.com or https://demo.nitsri.ac.in"
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
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-zinc-400" />
                    GitHub Repository URL <span className="text-zinc-500 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/foss-club/myproject"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    Project Description <span className="text-zinc-500 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what this project does, tech stack used, key features..."
                      className="w-full bg-[#111e16] border border-[#1b3123] rounded-lg p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#08B74F]/50 focus:ring-1 focus:ring-[#08B74F]/50 transition-all resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Preview Media (Image or Video) */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 block mb-1">
                    Preview Media Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange("image");
                        if (mediaType !== "image") form.setValue("previewUrl", "");
                      }}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                        field.value === "image"
                          ? "bg-[#08B74F]/15 border-[#08B74F] text-white shadow-[0_0_12px_rgba(8,183,79,0.2)]"
                          : "bg-[#0d1a12] border-[#1b3123] text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                      }`}
                    >
                      <Image className="w-4 h-4 text-[#08B74F]" /> Preview Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange("video");
                        if (mediaType !== "video") form.setValue("previewUrl", "");
                      }}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                        field.value === "video"
                          ? "bg-purple-500/15 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                          : "bg-[#0d1a12] border-[#1b3123] text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                      }`}
                    >
                      <Video className="w-4 h-4 text-purple-400" /> Preview Video
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mediaType === "image" ? (
              <FormField
                control={form.control}
                name="previewUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">
                      Preview Image <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={(url) => field.onChange(url)}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Upload a cover screenshot or banner of the project.
                    </p>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="previewUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">
                      Preview Video URL <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. https://domain.com/demo.mp4 or YouTube URL"
                        className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Provide a direct video link (.mp4/webm) or YouTube video link for project demo preview.
                    </p>

                    {/* Live Video Preview Box */}
                    {field.value && (
                      <div className="mt-3 rounded-xl border border-zinc-800 bg-black/60 overflow-hidden aspect-video relative flex items-center justify-center">
                        {field.value.includes("youtube.com") || field.value.includes("youtu.be") ? (
                          <iframe
                            src={field.value.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={field.value}
                            controls
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-[#08B74F] text-black hover:bg-[#08B74F]/90 transition-colors font-bold text-sm w-full md:w-auto h-10"
          >
            {isSubmitting
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update Project"
                : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
