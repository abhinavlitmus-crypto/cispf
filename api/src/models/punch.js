const mongoose = require("mongoose");

const punchSessionSchema = new mongoose.Schema(
  {
    punchIn: {
      type: Date,
    },
    punchOut: {
      type: Date,
    },
  },
  { _id: false } // prevents extra _id for each punch session
);

const punchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },

    details: {
      type: [punchSessionSchema],
      default: [],
    },

    date: {
      type: Date,
    },

    status: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("punchDetails", punchSchema);
