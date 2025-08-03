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
  redirectUris: [String],
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
  },
});

const AppValidation = Joi.object({
  _id: Joi.string().hex().length(24),
  username: Joi.string().required().min(3).max(30).trim(),
  email: Joi.string().required().email().max(100).lowercase().trim(),
  profile: Joi.string(),
  password: Joi.string().required().min(8).max(100),
});

const LooseAppValidation = AppValidation.fork(
  Object.keys(AppValidation.describe().keys),
  (field) => field.optional()
);

const publicFields = ["_id", "name", "clientId"];
const privateFields = [...publicFields];

const App = mongoose.model("App", mongooseAppSchema);

export { App, AppValidation, LooseAppValidation, publicFields, privateFields };
