const { check } = require("express-validator");
const { formValidation } = require("../others");
const websitePageModel = require("../../../models/websitePage");
const { PAGE_TYPES } = require("../../../models/websitePage");

const validations = {
    websitePageValidation: [
        check("type")
            .custom(async (value, { req }) => {
                // type is only needed when creating; on edit it comes from the saved page
                if (req.body._id) return true;
                if (!PAGE_TYPES.includes(value)) {
                    throw new Error("Invalid page type");
                }
                if (["NEWSLETTER", "POLICY", "POLICY_DISCUSSION", "TEAM"].includes(value)
                    && await websitePageModel.exists({ type: value, isDeleted: false })) {
                    throw new Error("Only one document is allowed for this page. Edit the existing document.");
                }
                return true;
            }),

        check("details.title")
            .trim()
            .notEmpty()
            .withMessage("Title is required"),

        check("details.slug")
            .trim()
            .notEmpty()
            .withMessage("Slug is required")
            .custom(async (value, { req }) => {
                const body = req.body;
                const type = body._id ? (await websitePageModel.findById(body._id))?.type : body.type;
                const result = await websitePageModel.findOne({
                    type,
                    "details.slug": value,
                    isDeleted: false,
                });
                if ((result && !body._id) || (result && result._id.toString() !== body._id.toString())) {
                    throw new Error("A Slug already exist with this name");
                }
            }),

        check("details.publishDate")
            .optional({ nullable: true, checkFalsy: true })
            .isISO8601()
            .withMessage("Publish date is invalid"),

        check("details.sections").custom(async (sections, { req }) => {
            const type = req.body._id
                ? (await websitePageModel.findById(req.body._id))?.type
                : req.body.type;
            if (type !== "NEWSLETTER") return true;
            if (!Array.isArray(sections) || !sections.length) throw new Error("Add at least one newsletter section");
            for (const [index, section] of sections.entries()) {
                const prefix = `Section ${index + 1}: `;
                if (!section || ![section.image, section.title, section.description].every((v) => typeof v === "string" && v.trim())) {
                    throw new Error(prefix + "image, title and description are required");
                }
                if (typeof section.publishedDate !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(section.publishedDate) || !Number.isFinite(Date.parse(section.publishedDate))) {
                    throw new Error(prefix + "a valid published date is required");
                }
                try {
                    const url = new URL(section.externalLink);
                    if (!["http:", "https:"].includes(url.protocol) || !url.hostname) throw new Error();
                } catch {
                    throw new Error(prefix + "a valid HTTP or HTTPS external link is required");
                }
            }
            return true;
        }),

        formValidation,
    ],
};

module.exports = validations;
