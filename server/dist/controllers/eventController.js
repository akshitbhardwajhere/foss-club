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
exports.downloadEventDocument = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getNextEvent = exports.getEvents = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
/**
 * Retrieves all events sorted by creation date in descending order.
 * Fetches basic details and the registration configuration's validUntil date.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 */
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma_1.default.event.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                date: true,
                isDateTentative: true,
                location: true,
                imageUrl: true,
                registrationConfig: {
                    select: {
                        validUntil: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getEvents = getEvents;
/**
 * Retrieves the closest upcoming active event (including events happening today).
 * Used primarily for the homepage countdown component.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 */
const getNextEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const nextEvent = yield prisma_1.default.event.findFirst({
            where: {
                date: {
                    gte: startOfToday, // Include live events happening today
                },
            },
            orderBy: {
                date: "asc", // Get the chronologically closest one first
            },
            include: { registrationConfig: true },
        });
        // It's perfectly normal for this to be null if there are no upcoming events
        res.json(nextEvent);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getNextEvent = getNextEvent;
/**
 * Retrieves a specific event by its ID.
 * Also includes its associated registration configuration if any.
 *
 * @param {Request} req - The express request object containing the event ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const event = yield prisma_1.default.event.findUnique({
            where: { id },
            include: { registrationConfig: true },
        });
        if (event) {
            res.json(event);
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getEventById = getEventById;
/**
 * Creates a new event entry in the database.
 *
 * @param {Request} req - The express request object containing event payload in body.
 * @param {Response} res - The express response object.
 */
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, date, isDateTentative, location, imageUrl, documentUrl, } = req.body;
        const event = yield prisma_1.default.event.create({
            data: {
                title,
                description,
                category,
                date: new Date(date),
                isDateTentative: isDateTentative || false,
                location,
                imageUrl,
                documentUrl: documentUrl || null,
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.createEvent = createEvent;
/**
 * Updates an existing event.
 * If a new image or document URL is provided, it automatically deletes the old asset from Cloudinary.
 *
 * @param {Request} req - The express request object containing the updated fields in body and event ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, date, isDateTentative, location, imageUrl, documentUrl, } = req.body;
        const id = req.params.id;
        const eventExists = yield prisma_1.default.event.findUnique({ where: { id } });
        if (eventExists) {
            if (imageUrl !== undefined &&
                eventExists.imageUrl &&
                imageUrl !== eventExists.imageUrl) {
                yield (0, cloudinary_1.deleteCloudinaryImage)(eventExists.imageUrl);
            }
            // If documentUrl was explicitly cleared or replaced, remove old one from Cloudinary
            if (documentUrl !== undefined &&
                eventExists.documentUrl &&
                documentUrl !== eventExists.documentUrl) {
                yield (0, cloudinary_1.deleteCloudinaryResource)(eventExists.documentUrl, "raw");
            }
            const updatedEvent = yield prisma_1.default.event.update({
                where: { id },
                data: {
                    title: title || undefined,
                    description: description || undefined,
                    category: category || undefined,
                    date: date ? new Date(date) : undefined,
                    isDateTentative: isDateTentative !== undefined ? isDateTentative : undefined,
                    location: location || undefined,
                    imageUrl: imageUrl === "" ? null : imageUrl || undefined,
                    documentUrl: documentUrl === "" ? null : documentUrl || undefined,
                },
            });
            res.json(updatedEvent);
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.updateEvent = updateEvent;
/**
 * Deletes an event by its ID.
 * Gracefully removes associated images and documents from Cloudinary before deleting the database record.
 *
 * @param {Request} req - The express request object containing the event ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const eventExists = yield prisma_1.default.event.findUnique({ where: { id } });
        if (eventExists) {
            if (eventExists.imageUrl) {
                yield (0, cloudinary_1.deleteCloudinaryImage)(eventExists.imageUrl);
            }
            if (eventExists.documentUrl) {
                yield (0, cloudinary_1.deleteCloudinaryResource)(eventExists.documentUrl, "raw");
            }
            yield prisma_1.default.event.delete({ where: { id } });
            res.json({ message: "Event removed" });
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.deleteEvent = deleteEvent;
/**
 * Streams the associated PDF document of an event to the client.
 * Fetches the document from Cloudinary server-side to avoid CORS issues.
 *
 * @param {Request} req - The express request object containing the event ID.
 * @param {Response} res - The express response object used to stream the PDF file.
 * @returns {Promise<void>}
 */
const downloadEventDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = req.params.id;
        const event = yield prisma_1.default.event.findUnique({ where: { id } });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (!event.documentUrl) {
            res.status(404).json({ message: "No document attached to this event" });
            return;
        }
        // Fetch the file from Cloudinary server-side (avoids all CORS issues)
        console.log("[doc-download] fetching:", event.documentUrl);
        const fileResponse = yield fetch(event.documentUrl);
        console.log("[doc-download] status:", fileResponse.status, fileResponse.statusText);
        if (!fileResponse.ok) {
            const errText = yield fileResponse.text().catch(() => "");
            console.error("[doc-download] body:", errText.slice(0, 300));
            res
                .status(502)
                .json({ message: "Failed to fetch document from storage" });
            return;
        }
        // Build a safe filename from the event title
        const safeName = event.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${safeName}-brochure.pdf"`);
        // Stream the Cloudinary response body directly to the client
        const reader = (_b = (_a = fileResponse.body) === null || _a === void 0 ? void 0 : _a.getReader) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (!reader) {
            // Fallback: buffer the entire response
            const buffer = yield fileResponse.arrayBuffer();
            res.send(Buffer.from(buffer));
            return;
        }
        const pump = () => __awaiter(void 0, void 0, void 0, function* () {
            const { done, value } = yield reader.read();
            if (done) {
                res.end();
                return;
            }
            res.write(value);
            yield pump();
        });
        yield pump();
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.downloadEventDocument = downloadEventDocument;
