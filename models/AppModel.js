import mongoose from "mongoose";
import Joi from "joi";

const mongooseAppSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  clientId: {
    type: String,
    unique: true,
  },
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
  },
  redirectUris: [String],
  redirectUrisDevelopment: [String],
  scope: [
    {
      type: String,
    },
  ],
  scopeUpdatedAt: {
    type: Date,
  },
  require2FA: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  numberOfUsers: {
    type: Number,
    default: 0,
  },
  icon: {
    type: String,
    default: "https://assets.kanapka.eu/images/app.png",
  },
});

mongooseAppSchema.pre("save", function (next) {
  if (this.isModified("scope")) {
    this.scopeUpdatedAt = new Date();
  }
  next();
});

const AppValidation = Joi.object({
  _id: Joi.string().hex().length(24),
  name: Joi.string().required().min(3).max(30).trim(),
  developer: Joi.string().hex().length(24),
  clientId: Joi.string().required().min(3).max(30).trim(),
  redirectUris: Joi.array().required().items(Joi.string().uri()).max(5),
  redirectUrisDevelopment: Joi.array().items(Joi.string().uri()).max(5),
  scope: Joi.array()
    .required()
    .items(
      Joi.string().valid(
        "username",
        "profile",
        "email",
        "age",
        "locale",
        "language",
        "createdAt"
      )
    )
    .min(1),
  require2FA: Joi.boolean(),
  icon: Joi.string().uri(),
});

const LooseAppValidation = AppValidation.fork(
  Object.keys(AppValidation.describe().keys),
  (field) => field.optional()
);

const publicFields = ["_id", "name", "clientId"];
const privateFields = [...publicFields];

const App = mongoose.model("App", mongooseAppSchema);

export { App, AppValidation, LooseAppValidation, publicFields, privateFields };
