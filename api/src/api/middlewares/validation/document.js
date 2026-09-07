const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
  documentValidation: [
    
    check("docName")
      .trim()
      .notEmpty()
      .withMessage("Document name is required")
      .isString()
      .withMessage("Document Name must be a string"),

     check("Url")
      .trim()
      .notEmpty()
      .withMessage("Upload a file")
      .isString()
      .withMessage("Upload a file"),

    formValidation,
  ],

 
};

module.exports = validations;
