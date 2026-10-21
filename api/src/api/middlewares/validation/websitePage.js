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

        formValidation,
    ],
};

module.exports = validations;
