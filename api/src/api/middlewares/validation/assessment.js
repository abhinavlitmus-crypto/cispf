const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
    assessmentValidation: [
        check("formId")
            .notEmpty()
            .withMessage("Form is required")
            .isMongoId()
            .withMessage("Form is invalid"),

        check("courseId")
            .notEmpty()
            .withMessage("Course is required")
            .isMongoId()
            .withMessage("Course is invalid"),

        check("moduleId")
            .optional({ nullable: true, checkFalsy: true })
            .isMongoId()
            .withMessage("Module is invalid"),

        check("lessonId")
            .optional({ nullable: true, checkFalsy: true })
            .isMongoId()
            .withMessage("Lesson is invalid"),

        check("targetType")
            .notEmpty()
            .withMessage("Target type is required")
            .isIn(["course", "module", "lesson"])
            .withMessage("Target type must be course, module or lesson"),

        check("targetType").custom((value, { req }) => {
            if (value === "module" && !req.body.moduleId) {
                throw new Error("Module is required when target type is module");
            }
            if (value === "lesson" && (!req.body.moduleId || !req.body.lessonId)) {
                throw new Error("Module and Lesson are required when target type is lesson");
            }
            return true;
        }),

        check("passPercentage")
            .optional()
            .isFloat({ min: 0, max: 100 })
            .withMessage("Pass percentage must be between 0 and 100"),

        formValidation,
    ],
};

module.exports = validations;
