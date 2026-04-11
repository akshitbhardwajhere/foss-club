"use client";

import dynamic from "next/dynamic";
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
import type { BlogFormValues } from "./formSchema";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-[#0d1a12] animate-pulse rounded-lg border border-[#1b3123]" />
  ),
});

interface BlogFormSectionProps {
  form: UseFormReturn<BlogFormValues>;
  isSubmitting: boolean;
  editingId: string | null;
  onSubmit: (values: BlogFormValues) => void;
}

export default function BlogFormSection({
  form,
  isSubmitting,
  editingId,
  onSubmit,
}: BlogFormSectionProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-300">
                  Blog Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Master the Linux File System"
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
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-300">
                  Author <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane Doe"
                    className="bg-[#111e16] border-[#1b3123] h-10 px-3 focus-visible:ring-[#08B74F] text-white text-sm"
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-1">
                <FormLabel className="text-xs font-medium text-zinc-300 block">
                  Blog Content <span className="text-red-500">*</span>
                </FormLabel>
                <span className="text-[10px] text-zinc-500 font-medium">
                  Min 50 characters
                </span>
              </div>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Start writing your blog post..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                ? "Update Blog"
                : "Publish Blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
