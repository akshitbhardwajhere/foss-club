import { Request, Response } from "express";
import prisma from "../config/prisma";
import { deleteCloudinaryImage } from "../utils/cloudinary";

/**
 * Retrieves all projects.
 * Sorted by custom order first, then chronologically by creation date.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Retrieves a single project by unique ID.
 *
 * @param {Request} req - The express request object containing the ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const getProjectById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Creates a new project.
 * Protected endpoint for administrators.
 *
 * @param {Request} req - The express request object containing project details.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      title,
      description,
      url,
      githubUrl,
      mediaType,
      previewUrl,
      developedBy,
      order,
    } = req.body;

    if (!title || !url || !previewUrl || !developedBy) {
      res.status(400).json({
        message: "Title, URL, Preview URL, and Developed By are required.",
      });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        url,
        githubUrl: githubUrl || null,
        mediaType: mediaType === "video" ? "video" : "image",
        previewUrl,
        developedBy,
        order: typeof order === "number" ? order : 0,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(
      "Project creation error:",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({ message: "Failed to create project" });
  }
};

/**
 * Updates an existing project by ID.
 * Clean up old image from Cloudinary if changed and mediaType is image.
 *
 * @param {Request} req - The express request object containing updated fields.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const updateProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      title,
      description,
      url,
      githubUrl,
      mediaType,
      previewUrl,
      developedBy,
      order,
    } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (
      existingProject.mediaType === "image" &&
      previewUrl &&
      existingProject.previewUrl &&
      previewUrl !== existingProject.previewUrl
    ) {
      await deleteCloudinaryImage(existingProject.previewUrl);
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description === "" ? null : description,
        url,
        githubUrl: githubUrl === "" ? null : githubUrl,
        mediaType: mediaType === "video" ? "video" : "image",
        previewUrl,
        developedBy,
        order: typeof order === "number" ? order : existingProject.order,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error(
      "Project update error:",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({ message: "Failed to update project" });
  }
};

/**
 * Deletes a project by ID.
 * Removes Cloudinary image asset if mediaType is image.
 *
 * @param {Request} req - The express request object containing the project ID.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (project.mediaType === "image" && project.previewUrl) {
      await deleteCloudinaryImage(project.previewUrl);
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(
      "Project deletion error:",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({ message: "Failed to delete project" });
  }
};

/**
 * Reorders projects dynamically.
 *
 * @param {Request} req - The express request object containing items: [{ id, order }].
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const reorderProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({
        message: "Invalid payload format. Expected { items: [{ id, order }] }",
      });
      return;
    }

    const updatePromises = items.map((item: { id: string; order: number }) =>
      prisma.project.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await prisma.$transaction(updatePromises);

    res.json({ message: "Projects reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder projects" });
  }
};
