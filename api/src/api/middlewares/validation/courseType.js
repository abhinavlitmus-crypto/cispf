const mongoose = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");
const courseTypeModal = require("../../../models/courseType");

const validations = {
    courseTypeValidation: [
        check("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required")
            .isString()
            .withMessage("Name must be a string"),

        check("slug")
            .trim()
            .notEmpty()
            .withMessage("Slug is required")
            .isString()
            .withMessage("Slug must be a string")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await courseTypeModal.findOne({
                    slug: value,
                    isDeleted: false,
                });
                // console.log(result, "rsult", value);
                if ((result && !body._id) || (result && result._id.toString() !== body._id.toString())) {
                    throw new Error("A Slug already exist with this name");
                }
            }),

        formValidation,
    ],

};

module.exports = validations;
