const mongoose = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");
const userModal = require("../../../models/user");

const validations = {
    userValidation: [
        check("name")
            .custom((value, { req }) => {
                if (!req.body._id && !(value && value.trim())) {
                    throw new Error("Name is required");
                }
                return true;
            }),

        check("name")
            .optional({ checkFalsy: true })
            .trim()
            .isString()
            .withMessage("Name must be a string"),

        check("age")
            .optional({ checkFalsy: true })
            .isInt({ min: 1, max: 120 })
            .withMessage("Age must be a number between 1 and 120")
            .toInt(),

        check("photoUrl")
            .optional({ checkFalsy: true })
            .isString()
            .withMessage("Upload a file"),

        check("phoneNumber")
            .optional({ checkFalsy: true })
            .trim()
            .isString()
            .withMessage("Phone Number must be a string")
            .custom(async (value, { req }) => {
                    const body = req.body;
                const result = await userModal.findOne({
                    phoneNumber: value,
                    isDeleted: false,
                });
                // console.log(result, "rsult", value);
                if ((result && !body._id) || (result && result._id != body._id)) {
                    throw new Error("A user already exist with this phone number");
                }
            }),


        check("language")
            .optional({ checkFalsy: true })
            .isString()
            .withMessage("Language must be a valid language id"),

        check("state")
            .optional({ checkFalsy: true })
            .trim()
            .isString()
            .withMessage("State must be a string"),

        check("city")
            .optional({ checkFalsy: true })
            .trim()
            .isString()
            .withMessage("City must be a string"),

        formValidation,
    ],

};

module.exports = validations;
