import mongoose from "mongoose";
import Joi from "joi";

const mongooseDeveloperSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  apps: [
    {
      _id: false,
      app: { type: mongoose.Schema.Types.ObjectId, ref: "App" },
      role: { type: String },
    },
  ],
});

const DeveloperValidation = Joi.object({
  _id: Joi.string().hex().length(24),
  user: Joi.string().hex().length(24),
});

const LooseDeveloperValidation = DeveloperValidation.fork(
  Object.keys(DeveloperValidation.describe().keys),
  (field) => field.optional()
);

const publicFields = ["_id", "user"];
const privateFields = ["apps", ...publicFields];

const Developer = mongoose.model("Developer", mongooseDeveloperSchema);

export {
  Developer,
  DeveloperValidation,
  LooseDeveloperValidation,
  publicFields,
  privateFields,
};
