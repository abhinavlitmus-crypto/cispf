const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs"),
  SALT_WORK_FACTOR = 10;

const modelSchema = new Schema(
  {
    avatar: {
      type: String,
    },

    name: String,

    email: String,
    userType: {
      type: String,
      enum: ["SuperAdmin", "trainer"],
    },
    rights: {
      type: Array,
    },

    password: String,
    moduleAccess: {
      beneficiaries: {
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Rejected"
        },
        expiryDate: {
          type: Date,
          default: null
        }
      }
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
  { timestamps: true }
);

modelSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = model("admin", modelSchema);
