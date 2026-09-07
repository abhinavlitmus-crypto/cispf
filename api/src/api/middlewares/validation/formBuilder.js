const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
    formBuilderValidation: [
        check("name")
            .if((value, { req }) => !req.body._id)
            .trim()
            .notEmpty()
            .withMessage("Form name is required"),

        formValidation,
    ],
};

module.exports = validations;
