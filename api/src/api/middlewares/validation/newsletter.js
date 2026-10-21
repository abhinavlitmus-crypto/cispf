const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
    newsletterValidation: [
        check("title").optional().isString().withMessage("Title must be a string"),
        check("date").optional().isISO8601().withMessage("Date is invalid"),
        check("sections").isArray({ min: 1 }).withMessage("Add at least one section"),
        check("sections.*.title").trim().notEmpty().withMessage("Every section needs a title"),
        check("sections.*.buttonLink")
            .optional({ checkFalsy: true })
            .isURL({ require_protocol: true })
            .withMessage("Section button link must be a full URL (https://...)"),
        check(["socialLinks.facebook", "socialLinks.twitter", "socialLinks.linkedin", "socialLinks.whatsapp"])
            .optional({ checkFalsy: true })
            .isURL({ require_protocol: true })
            .withMessage("Social links must be full URLs (https://...)"),
        formValidation,
    ],

    sendValidation: [
        check("name").trim().notEmpty().withMessage("Name is required"),
        check("toEmail").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
        check("_id").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid newsletter id"),
        formValidation,
    ],
};

module.exports = validations;
