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
// @desc    Get all team members
// @route   GET /api/team
// @access  Public
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
// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
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
// @desc    Create a team member
// @route   POST /api/team
// @access  Private/Admin
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
// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
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
// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
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
// @desc    Reorder team members
// @route   PUT /api/team/reorder
// @access  Private/Admin
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
