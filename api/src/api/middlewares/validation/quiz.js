const mongoose = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");
const quizModal = require("../../../models/quiz");

const validations = {
    quizValidation: [
        check("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title must be a string"),

        check("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required")
            .isString()
            .withMessage("Description must be a string"),

        check("slug")
            .trim()
            .notEmpty()
            .withMessage("Slug is required")
            .isString()
            .withMessage("Slug must be a string")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await quizModal.findOne({
                    slug: value,
                    isDeleted: false,
                });
                // console.log(result, "rsult", value);
                if ((result && !body._id) || (result && result._id.toString() !== body._id.toString())) {
                    throw new Error("A Slug already exist with this name");
                }
            }),

        check("questionDetails")
            .isArray({ min: 1 })
            .withMessage("At least one question is required"),

        check("questionDetails.*.question")
            .trim()
            .notEmpty()
            .withMessage("Question is required")
            .isString()
            .withMessage("Question must be a string"),

        check("questionDetails.*.options")
            .isArray({ min: 2 })
            .withMessage("Each question must have at least 2 options"),

        check("questionDetails.*.options.*")
            .trim()
            .notEmpty()
            .withMessage("Option cannot be empty")
            .isString()
            .withMessage("Option must be a string"),

        check("questionDetails.*.answer")
            .notEmpty()
            .withMessage("Answer is required")
            .custom((value, { req, path }) => {
                const index = path.match(/\d+/)[0]; // get array index
                const options = req.body.questionDetails[index].options;

                if (!options.includes(value)) {
                    throw new Error("Answer must be one of the options");
                }
                return true;
            }),


        formValidation,
    ],

};

module.exports = validations;
