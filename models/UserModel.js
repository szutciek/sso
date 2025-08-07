import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";

const mongooseUserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    select: false,
  },
  profile: {
    type: String,
    default: "https://assets.kanapka.eu/images/user.png",
  },
  password: {
    type: String,
    select: false,
  },
  birthday: {
    type: Number,
  },
  gender: {
    type: String,
  },
  locale: {
    type: String,
  },
  language: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  // 2FA
  use2FA: {
    type: Boolean,
    default: false,
  },
  code2FA: {
    type: String,
    select: false,
  },
  last2FAGeneration: {
    type: Date,
  },
  last2FAEmail: {
    type: Date,
  },
  // DEVELOPER
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
  },
  // APPS
  apps: [
    {
      _id: false,
      app: { type: mongoose.Schema.Types.ObjectId, ref: "App" },
      status: { type: String },
    },
  ],
  // EMAIL VERIFICATION
  verifiedEmail: {
    type: Boolean,
    select: false,
  },
  emailVerificationCode: {
    type: String,
    select: false,
  },
  // PASSWORD CHANGE
  passwordLastChanged: {
    type: Date,
    select: false,
  },
  passwordChangeCodeExpiration: {
    type: Date,
    select: false,
  },
  passwordChangeCode: {
    type: String,
    select: false,
  },
});

mongooseUserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.passwordLastChanged = new Date();
  }
  next();
});

mongooseUserSchema.methods.setPassword = function (password) {
  this.passwordLastChanged = new Date();
  this.password = bcrypt.hashSync(password, 9);
};

mongooseUserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
const oneHundredYearsAgo = new Date();
oneHundredYearsAgo.setFullYear(oneHundredYearsAgo.getFullYear() - 100);

const UserValidation = Joi.object({
  _id: Joi.string().hex().length(24),
  username: Joi.string().required().min(3).max(30).trim(),
  email: Joi.string().required().email().max(100).lowercase().trim(),
  profile: Joi.string(),
  password: Joi.string().required().min(8).max(100),
  birthday: Joi.number()
    .required()
    .min(new Date(oneHundredYearsAgo).getTime())
    .max(new Date(eighteenYearsAgo).getTime())
    .messages({
      "number.min": `"birthday" must be sooner than 100 years ago.`,
      "number.max": `"birthday" must be later than 18 years ago.`,
    }),
  gender: Joi.string().required().valid("male", "female", "other"),
  locale: Joi.string().required().length(2).lowercase(),
  language: Joi.string()
    .required()
    .length(2)
    .lowercase()
    .valid("en")
    .messages({ "any.only": "Only en supported" }),
  use2FA: Joi.boolean(),
});

const LooseUserValidation = UserValidation.fork(
  Object.keys(UserValidation.describe().keys),
  (field) => field.optional()
);

const publicFields = [
  "_id",
  "username",
  "profile",
  "birthday",
  "locale",
  "language",
  "gender",
];
const privateFields = ["email", ...publicFields];

const User = mongoose.model("User", mongooseUserSchema);

export {
  User,
  UserValidation,
  LooseUserValidation,
  publicFields,
  privateFields,
};
