"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderTeamMembers = exports.deleteTeamMember = exports.updateTeamMember = exports.createTeamMember = exports.getTeamMemberById = exports.getTeamMembers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
/**
 * Retrieves all core team members.
 * Sorts them by their custom order first, then chronologically by creation date.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const getTeamMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamMembers = yield prisma_1.default.teamMember.findMany({
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        });
        res.json(teamMembers);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getTeamMembers = getTeamMembers;
/**
 * Retrieves a single team member by their unique ID.
 *
 * @param {Request} req - The express request object containing the ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const getTeamMemberById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const teamMember = yield prisma_1.default.teamMember.findUnique({
            where: { id },
        });
        if (teamMember) {
            res.json(teamMember);
        }
        else {
            res.status(404).json({ message: "Team member not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getTeamMemberById = getTeamMemberById;
/**
 * Creates a new team member profile.
 * Only accessible by administrators.
 *
 * @param {Request} req - The express request object containing the new member's details.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const createTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, email, githubUrl, linkedinUrl, imageUrl } = req.body;
        const teamMember = yield prisma_1.default.teamMember.create({
            data: {
                name,
                role,
                email,
                githubUrl,
                linkedinUrl,
                imageUrl,
            },
        });
        res.status(201).json(teamMember);
    }
    catch (error) {
        console.error("Team member creation error:", error instanceof Error ? error.message : error);
        res.status(500).json({ message: "Failed to create team member" });
    }
});
exports.createTeamMember = createTeamMember;
/**
 * Updates an existing team member's profile.
 * Automatically handles the deletion of their old image from Cloudinary if a new one is provided.
 *
 * @param {Request} req - The express request object containing the updated fields.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const updateTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, email, githubUrl, linkedinUrl, imageUrl } = req.body;
        const id = req.params.id;
        const teamMember = yield prisma_1.default.teamMember.findUnique({
            where: { id },
        });
        if (!teamMember) {
            res.status(404).json({ message: "Team member not found" });
            return;
        }
        if (imageUrl !== undefined &&
            teamMember.imageUrl &&
            imageUrl !== teamMember.imageUrl) {
            yield (0, cloudinary_1.deleteCloudinaryImage)(teamMember.imageUrl);
        }
        const updatedTeamMember = yield prisma_1.default.teamMember.update({
            where: { id },
            data: {
                name,
                role,
                email,
                githubUrl: githubUrl === "" ? null : githubUrl,
                linkedinUrl: linkedinUrl === "" ? null : linkedinUrl,
                imageUrl: imageUrl === "" ? null : imageUrl,
            },
        });
        res.json(updatedTeamMember);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update team member" });
    }
});
exports.updateTeamMember = updateTeamMember;
/**
 * Removes a team member completely from the database.
 * Also cleans up their associated image asset from Cloudinary.
 *
 * @param {Request} req - The express request object containing the member ID.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const deleteTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const teamMember = yield prisma_1.default.teamMember.findUnique({
            where: { id },
        });
        if (!teamMember) {
            res.status(404).json({ message: "Team member not found" });
            return;
        }
        if (teamMember.imageUrl) {
            yield (0, cloudinary_1.deleteCloudinaryImage)(teamMember.imageUrl);
        }
        yield prisma_1.default.teamMember.delete({
            where: { id },
        });
        res.json({ message: "Team member removed" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete team member" });
    }
});
exports.deleteTeamMember = deleteTeamMember;
/**
 * Reorders team members dynamically based on drag-and-drop actions in the UI.
 * Uses a bulk transaction to ensure complete atomicity of the order update.
 *
 * @param {Request} req - The express request object containing an array of `{ id, order }`.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const reorderTeamMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        if (!Array.isArray(items)) {
            res.status(400).json({
                message: "Invalid payload format. Expected { items: [{ id, order }] }",
            });
            return;
        }
        // Perform bulk update in a transaction
        const updatePromises = items.map((item) => prisma_1.default.teamMember.update({
            where: { id: item.id },
            data: { order: item.order },
        }));
        yield prisma_1.default.$transaction(updatePromises);
        res.json({ message: "Team members reordered successfully" });
    }
    catch (error) {
        console.error("Team reorder error:", error instanceof Error ? error.message : error);
        res.status(500).json({ message: "Failed to reorder team members" });
    }
});
exports.reorderTeamMembers = reorderTeamMembers;
