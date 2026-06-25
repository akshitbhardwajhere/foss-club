"use client";

import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import dynamic from "next/dynamic";
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
import PdfUpload from "@/components/PdfUpload";
import type { EventFormValues } from "./formSchema";
import { EVENT_CATEGORIES } from "./formSchema";
import { PlusCircle, Trash2, Users } from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] w-full bg-[#0d1a12] animate-pulse rounded-lg border border-[#1b3123]" />
  ),
});

interface EventFormSectionProps {
  form: UseFormReturn<EventFormValues>;
  isSubmitting: boolean;
  editingId: string | null;
  onSubmit: (values: EventFormValues) => void;
}

export default function EventFormSection({
  form,
  isSubmitting,
  editingId,
  onSubmit,
}: EventFormSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "speakers",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-300">
                      Event Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Introduction to Linux Systems"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-300">
                      Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group/select">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover/select:text-[#08B74F]/70 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.38 3H5.5ZM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                              clipRule="evenodd"
                            />
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
                            Select a category
                          </option>
                          {EVENT_CATEGORIES.map((cat) => (
                            <option
                              key={cat}
                              value={cat}
                              className="bg-zinc-900 text-white"
                            >
                              {cat}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1">
                      <FormLabel className="text-xs font-medium text-zinc-300">
                        Date & Time <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="isDateTentative"
                        render={({ field: isTentativeField }) => (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              id="isTentative"
                              checked={isTentativeField.value}
                              onChange={(e) => {
                                const isTentative = e.target.checked;
                                isTentativeField.onChange(isTentative);
                                const currentDate = form.getValues().date;
                                if (currentDate) {
                                  if (isTentative && currentDate.length >= 7) {
                                    form.setValue(
                                      "date",
                                      currentDate.slice(0, 7),
                                    );
                                  } else if (
                                    !isTentative &&
                                    currentDate.length === 7
                                  ) {
                                    form.setValue(
                                      "date",
                                      `${currentDate}-01T12:00`,
                                    );
                                  }
                                }
                              }}
                              className="w-3 h-3 rounded bg-[#111e16] border-[#08B74F] text-[#08B74F] cursor-pointer"
                            />
                            <label
                              htmlFor="isTentative"
                              className="text-[10px] text-zinc-400 cursor-pointer hover:text-zinc-300"
                            >
                              Tentative Month/Year
                            </label>
                          </div>
                        )}
                      />
                    </div>
                    <FormControl>
                      <Input
                        type={
                          form.watch("isDateTentative")
                            ? "month"
                            : "datetime-local"
                        }
                        className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm w-full block scheme-dark"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300">
                    Location / Link <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Room 201 or Zoom Link"
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
                  <div className="flex items-center justify-between mb-1">
                    <FormLabel className="text-xs font-medium text-zinc-300 block">
                      Event Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      Min 10 characters
                    </span>
                  </div>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Start writing the event description and agenda..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">
                    Cover Image
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url)}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    16:9 ratio, max 2MB.
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">
                    Event Brochure / Document{" "}
                    <span className="text-zinc-500 font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <PdfUpload
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url)}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    PDF only, max 10MB. Users will see a download button.
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-300 mb-1 block">
                    Registration Link{" "}
                    <span className="text-zinc-500 font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. https://forms.gle/... or external link"
                      className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    If provided, registration buttons will direct users to this URL.
                  </p>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Dynamic Speakers & Hosts Section */}
        <div className="border-t border-zinc-800 pt-6 mt-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#08B74F]" /> Hosts & Speakers
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                Add profile details for speakers, key organizers, or mentors leading this event.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  role: "",
                  org: "",
                  imageUrl: "",
                  github: "",
                  linkedin: "",
                  bio: "",
                })
              }
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700/80 transition-all text-xs font-bold shrink-0 self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4 text-[#08B74F]" /> Add Host / Speaker
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-850 p-8 text-center text-zinc-600 text-xs">
              No hosts or speakers added yet. Click &quot;Add Host / Speaker&quot; to list speakers.
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-5 rounded-2xl border border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 transition-colors relative space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                    <span className="text-xs font-black text-[#08B74F]/80 uppercase tracking-widest">
                      Host / Speaker #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-zinc-600 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-zinc-900/50"
                      title="Remove Speaker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
                    {/* Left: Speaker Avatar Upload */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name={`speakers.${index}.imageUrl`}
                        render={({ field: imgField }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              Profile Image
                            </FormLabel>
                            <FormControl>
                              <div className="w-full max-w-[140px]">
                                <ImageUpload
                                  value={imgField.value || ""}
                                  onChange={(url) => imgField.onChange(url)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right: Speaker Attributes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`speakers.${index}.name`}
                        render={({ field: nameField }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Akshit Bhardwaj"
                                className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                                {...nameField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`speakers.${index}.role`}
                        render={({ field: roleField }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              Role / Designation *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Technical Lead"
                                className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                                {...roleField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`speakers.${index}.org`}
                        render={({ field: orgField }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              Organization *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. FOSS Club NIT Srinagar"
                                className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
                                {...orgField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name={`speakers.${index}.github`}
                          render={({ field: ghField }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                GitHub Link
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://github.com/..."
                                  className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-xs"
                                  {...ghField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`speakers.${index}.linkedin`}
                          render={({ field: liField }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                LinkedIn Link
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://linkedin.com/in/..."
                                  className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-xs"
                                  {...liField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`speakers.${index}.bio`}
                        render={({ field: bioField }) => (
                          <FormItem className="col-span-full">
                            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              Brief Bio *
                            </FormLabel>
                            <FormControl>
                              <textarea
                                className="w-full h-20 bg-[#111e16] border border-[#1b3123] rounded-lg p-3 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#08B74F]/50 focus:ring-1 focus:ring-[#08B74F]/50 transition-all resize-none"
                                placeholder="Write a short summary of the speaker's topics, domain expertise, etc."
                                {...bioField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                : "Publishing..."
              : editingId
                ? "Update Event"
                : "Publish Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
