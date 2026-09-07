const mongoose = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");
const cityModal = require("../../../models/city");
const state = require("../../../models/state");

const validations = {
    cityValidation: [
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
                const result = await cityModal.findOne({
                    slug: value,
                    isDeleted: false,
                });
                // console.log(result, "rsult", value);
                if ((result && !body._id) || (result && result._id.toString() !== body._id.toString())) {
                    throw new Error("A Slug already exist with this name");
                }
            }),
        check("state")
            .trim()
            .notEmpty()
            .withMessage("State is required")
            .isString()
            .withMessage("State must be a string")
            .custom(async (value, { req }) => {
                const body = req.body;
                const result = await state.findOne({
                    _id: value,
                    isDeleted: false,
                });
                // console.log(result, "rsult", value);
                if (!result) {
                    throw new Error("State is not present in System");
                }
            }),

        formValidation,
    ],

};

module.exports = validations;
