const mongoose = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");

const objectIdCheck = (field, label) =>
    check(field)
        .notEmpty()
        .withMessage(`${label} is required`)
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`${label} must be a valid MongoDB ObjectId`);
            }
            return true;
        });

const validations = {
    progressUpdateValidation: [
        objectIdCheck("courseId", "Course"),
        objectIdCheck("moduleId", "Module"),
        objectIdCheck("lessonId", "Lesson"),

        check("watchedSeconds")
            .notEmpty()
            .withMessage("Watched seconds is required")
            .isFloat({ min: 0 })
            .withMessage("Watched seconds must be a positive number"),

        check("markCompleted")
            .optional()
            .isBoolean()
            .withMessage("markCompleted must be a boolean"),

        formValidation,
    ],
};

module.exports = validations;
