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
  },
  profile: {
    type: String,
    default: "https://assets.kanapka.eu/images/user.png",
  },
  password: {
    type: String,
    select: false,
  },
  use2FA: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // 2FA
  code2FA: {
    type: String,
    select: false,
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

mongooseUserSchema.methods.setPassword = function (password) {
  this.passwordLastChanged = new Date();
  this.password = bcrypt.hashSync(password, 9);
};

mongooseUserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserValidation = Joi.object({
  _id: Joi.string().hex().length(24),
  username: Joi.string().required().min(3).max(30).trim(),
  email: Joi.string().required().email().max(100).lowercase().trim(),
  profile: Joi.string(),
  password: Joi.string().required().min(8).max(100),
});

const LooseUserValidation = UserValidation.fork(
  Object.keys(UserValidation.describe().keys),
  (field) => field.optional()
);

const AppValidation = Joi.object({
  app: Joi.required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("ObjectId.invalid", { value });
    }
    return value;
  }, "ObjectId Validation"),
  status: Joi.boolean().required(),
});

const publicFields = ["_id", "username", "profile"];
const privateFields = ["email", ...publicFields];

const User = mongoose.model("User", mongooseUserSchema);

export {
  User,
  UserValidation,
  LooseUserValidation,
  AppValidation,
  publicFields,
  privateFields,
};
