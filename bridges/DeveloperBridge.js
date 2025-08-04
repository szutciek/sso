import {
  Developer,
  DeveloperValidation,
  LooseDeveloperValidation,
} from "../models/DeveloperModel.js";
import performValidation from "../utils/performValidation.js";
import catchDuplicateError from "../utils/catchDuplicateError.js";
import AppError from "../utils/AppError.js";

export const getDeveloperById = async (developerId, selectString) => {
  const idValidationScheme = DeveloperValidation.extract("_id");
  const validId = performValidation(idValidationScheme, developerId);
  const developer = await Developer.findById(validId)
    .select(selectString)
    .populate("user")
    .populate("apps.app");
  if (!developer) {
    throw new AppError("Developer not found", 404);
  }
  return developer;
};

export const createDeveloper = async (developerData) => {
  let developer = null;
  await catchDuplicateError(async () => {
    const validatedData = performValidation(DeveloperValidation, developerData);
    validatedData.createdAt = new Date();
    developer = new Developer(validatedData);
    await developer.save();
  });
  return developer;
};

export const updateDeveloper = async (developerId, updateData) => {
  let developer = null;
  await catchDuplicateError(async () => {
    developer = await getDeveloperById(developerId);
    const validatedData = performValidation(
      LooseDeveloperValidation,
      updateData
    );
    Object.assign(developer, validatedData);
    await developer.save();
  });
  return developer;
};

export const deleteDeveloper = async (developerId) => {
  return await Developer.deleteOne({ _id: developerId });
};
