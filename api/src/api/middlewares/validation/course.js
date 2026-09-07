const mongoose = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
    courseValidation: [
        check("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title must be a string"),

        check("thumbNail")
            .trim()
            .notEmpty()
            .withMessage("Thumb Nail is required")
            .isString()
            .withMessage("Thumb Nail must be a string"),

        check("courseVideo")
            .optional({ checkFalsy: true })
            .trim()
            .isString()
            .withMessage("Course Video must be a string"),

        check("documentLabel")
            .optional({ checkFalsy: true })
            .trim()
            .isString().withMessage("Document label must be a string"),

        check("documentURL")
            .optional({ checkFalsy: true })
            .trim()
            .isURL().withMessage("Document URL must be valid"),

        check("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required")
            .isString()
            .withMessage("Description must be a string"),

        check("language")
            .trim()
            .notEmpty()
            .withMessage("Language is required"),
            
        check("courseType")
            .trim()
            .notEmpty()
            .withMessage("Course Type is required")
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error("Course Type must be a valid MongoDB ObjectId");
                }
                return true;
            }),



        check("modules")
            .isArray({ min: 1 })
            .withMessage("At least one Module is required"),

        check("modules.*.title")
            .trim()
            .notEmpty().withMessage("Module title is required"),

        check("modules.*.description")
            .trim()
            .notEmpty().withMessage("Module description is required"),

        check("modules.*.documentLabel")
            .optional({ checkFalsy: true })
            .trim()
            .isString().withMessage("Module document label must be a string"),

        check("modules.*.documentURL")
            .optional({ checkFalsy: true })
            .trim()
            .isURL().withMessage("Module document URL must be valid"),

        check("modules.*.lessons")
            .isArray({ min: 1 })
            .withMessage("At least one Lesson is required"),

        check("modules.*.lessons.*.title")
            .trim()
            .notEmpty().withMessage("Lesson title is required"),

        check("modules.*.lessons.*.description")
            .trim()
            .notEmpty().withMessage("Lesson description is required"),

        check("modules.*.lessons.*.videoURL")
            .trim()
            .notEmpty().withMessage("Video URL is required")
            .isURL().withMessage("Video URL must be valid"),

        check("modules.*.lessons.*.documentLabel")
            .optional({ checkFalsy: true })
            .trim()
            .isString().withMessage("Document label must be a string"),

        check("modules.*.lessons.*.documentURL")
            .optional({ checkFalsy: true })
            .trim()
            .isURL().withMessage("Document URL must be valid"),

        // check("modules.*.quiz")
        //     .notEmpty()
        //     .withMessage("Quiz is required")
        //     .custom((value) => {
        //         if (!mongoose.Types.ObjectId.isValid(value)) {
        //             throw new Error("Quiz must be a valid MongoDB ObjectId");
        //         }
        //         return true;
        //     }),


        formValidation,
    ],

};

module.exports = validations;
