const mongoose = require("mongoose");
const { check } = require("express-validator");
const { formValidation } = require("../others");
const client = require("../../../models/client");

const validations = {
  clientValidation: [
    check("clientName")
      .trim()
      .notEmpty()
      .withMessage("Client name is required")
      .isString()
      .withMessage("Client name must be a string"),

    check("age")
      .notEmpty()
      .withMessage("Age is required")
      .isInt({ min: 1, max: 99 })
      .withMessage("Age must be a number between 1 and 99"),


    check("gender")
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["male", "female", "transgender", "other"])
      .withMessage("Gender must be one of: male, female, transgender, or other"),

    check("state")
      .trim()
      .notEmpty()
      .withMessage("State is required")
      .isString()
      .withMessage("State must be a string"),

    check("city")
      .trim()
      .notEmpty()
      .withMessage("City is required")
      .isString()
      .withMessage("City must be a string"),



    check("topology")
      .notEmpty()
      .withMessage("Typology is required")
      .isIn(["MSM", "transgender", "FSW", "PWID", "others"])
      .withMessage(
        "Typology must be one of: MSM, transgender, FSM, PWID, others"
      ),

    check("referralBy")
      .notEmpty()
      .withMessage("Referral is required")
      .isIn(["instagram", "facebook", "whatsapp", "friend", "other", "website", "Ad lead"])
      .withMessage(
        "Referral must be one of: instagram, facebook, whatsapp, friend, other, website, Ad lead"
      ),

    check("outreachDate")
      .notEmpty()
      .withMessage("Outreach date is required")
      .isISO8601()
      .withMessage("Outreach date must be a valid date"),


    check("typeOfOutreach")
      .notEmpty()
      .withMessage("Type of outreach is required")
      .isIn(["physical", "virtual"])
      .withMessage("Type of outreach must be either 'physical' or 'virtual'"),

    formValidation,
  ],

};

module.exports = validations;
