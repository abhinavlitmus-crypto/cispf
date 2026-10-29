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

    // Public website signup form
    subscribeValidation: [
        check("name").optional({ checkFalsy: true }).isString().withMessage("Name is invalid").bail()
            .trim().isLength({ max: 120 }).withMessage("Name must be 120 characters or fewer"),
        check("email").isString().withMessage("Please enter your email address").bail()
            .trim().notEmpty().withMessage("Please enter your email address").bail()
            .isLength({ max: 254 }).withMessage("Please enter a valid email address").bail()
            .isEmail().withMessage("Please enter a valid email address"),
        check("consent").custom((value) => value === true || value === "true")
            .withMessage("Please confirm that you would like to receive the CISPF newsletter"),
        formValidation,
    ],
};

module.exports = validations;
