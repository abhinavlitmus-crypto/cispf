const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
    assessmentSubmitValidation: [
        check("assignmentId")
            .notEmpty()
            .withMessage("Assignment is required")
            .isMongoId()
            .withMessage("Assignment is invalid"),

        check("answers")
            .notEmpty()
            .withMessage("Answers are required")
            .custom((value) => typeof value === "object" && !Array.isArray(value))
            .withMessage("Answers must be an object"),

        formValidation,
    ],
};

module.exports = validations;
