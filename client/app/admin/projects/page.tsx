"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderGit2, Edit3, Plus, ExternalLink, Github, Video, Image as ImageIcon } from "lucide-react";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";
import ProjectFormSection from "@/components/admin/projects/ProjectFormSection";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/components/admin/projects/projectFormSchema";
import { toast } from "sonner";

interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  githubUrl?: string;
  mediaType: "image" | "video";
  previewUrl: string;
  developedBy: string;
  order: number;
}

const TABLE_COLUMNS = ["Project Details", "Developed By", "Links", "Media Type", "Actions"];

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      githubUrl: "",
      mediaType: "image",
      previewUrl: "",
      developedBy: "",
    },
  });

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title?: string) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success(`Project "${title}" deleted successfully.`);
    } catch (err) {
      toast.error("An error occurred while deleting the project.");
    }
  };

  const handleEdit = (project: ProjectItem) => {
    form.reset({
      title: project.title || "",
      description: project.description || "",
      url: project.url || "",
      githubUrl: project.githubUrl || "",
      mediaType: project.mediaType || "image",
      previewUrl: project.previewUrl || "",
      developedBy: project.developedBy || "",
    });
    setEditingId(project.id);
    setIsCreating(true);
  };

  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await api.put(`/api/projects/${editingId}`, values);
        toast.success("Project updated successfully.");
      } else {
        await api.post("/api/projects", values);
        toast.success("New project added!");
      }
      await fetchProjects();
      setIsCreating(false);
      setEditingId(null);
      form.reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to save project.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pt-6 md:pt-12 overflow-x-hidden w-full max-w-8xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <AdminPageHeader
          icon={FolderGit2}
          iconClassName="bg-[#08B74F]/10 text-[#08B74F] border-[#08B74F]/20"
          title="Manage Projects"
          subtitle="Add, edit, or remove showcase projects developed by FOSS Club members"
        />
        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              form.reset({
                title: "",
                description: "",
                url: "",
                githubUrl: "",
                mediaType: "image",
                previewUrl: "",
                developedBy: "",
              });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08B74F] text-black font-bold hover:bg-[#08B74F]/90 transition-colors w-full md:w-auto justify-center shadow-[0_0_20px_rgba(8,183,79,0.2)]"
          >
            <Plus className="w-5 h-5" /> Add Project
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {isCreating ? (
        <AdminFormWrapper
          title={editingId ? "Edit Project Details" : "New Project Details"}
          onCancel={cancelForm}
          error={error}
        >
          <ProjectFormSection
            form={form}
            isSubmitting={isSubmitting}
            editingId={editingId}
            onSubmit={onSubmit}
          />
        </AdminFormWrapper>
      ) : (
        <motion.div
          className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="overflow-x-auto min-h-75">
            {loading ? (
              <AdminTableSkeleton columns={TABLE_COLUMNS} />
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-zinc-400">
                <FolderGit2 className="w-12 h-12 mb-4 text-zinc-600" />
                <p className="text-lg font-medium">No projects added yet.</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 text-[#08B74F] hover:underline font-medium"
                >
                  Add your first project
                </button>
              </div>
            ) : (
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">Project Details</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Developed By</th>
                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Links</th>
                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Media</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {project.mediaType === "image" && project.previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={project.previewUrl}
                              alt={project.title}
                              className="w-12 h-12 rounded-lg bg-zinc-800 object-cover hidden sm:block border border-zinc-700/50"
                            />
                          ) : project.mediaType === "video" ? (
                            <div className="w-12 h-12 rounded-lg bg-purple-950/40 border border-purple-800/40 hidden sm:flex items-center justify-center text-purple-400">
                              <Video className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-zinc-800 hidden sm:flex items-center justify-center text-zinc-500">
                              <FolderGit2 className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-sm md:text-base truncate max-w-xs">
                              {project.title}
                            </p>
                            {project.description && (
                              <p className="text-xs text-zinc-400 truncate max-w-xs">
                                {project.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-zinc-300 text-sm hidden md:table-cell">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700/50">
                          {project.developedBy}
                        </span>
                      </td>

                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[#08B74F] hover:underline font-medium"
                          >
                            Live Demo <ExternalLink className="w-3 h-3" />
                          </a>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-white transition-colors"
                              title="GitHub Repository"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          project.mediaType === "video"
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        }`}>
                          {project.mediaType === "video" ? (
                            <>
                              <Video className="w-3 h-3" /> Video
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-3 h-3" /> Image
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            title="Edit project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <ConfirmDeleteDialog
                            trigger={
                              <button
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                title="Delete project"
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                >
                                  <path
                                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </button>
                            }
                            itemName={project.title}
                            onConfirm={() => handleDelete(project.id, project.title)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
