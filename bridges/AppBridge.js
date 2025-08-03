import { App, AppValidation } from "../models/AppModel.js";
import performValidation from "../utils/performValidation.js";
import catchDuplicateError from "../utils/catchDuplicateError.js";
import AppError from "../utils/AppError.js";

export const getAppById = async (appId, selectString) => {
  const idValidationScheme = AppValidation.extract("_id");
  const validId = performValidation(idValidationScheme, appId);
  const app = await App.findById(validId).select(selectString);
  if (!app) {
    throw new AppError("App not found", 404);
  }
  return app;
};

export const getAppByProperty = async (property, selectString) => {
  const validated = performValidation(LooseAppValidation, property);
  const app = await App.findOne(validated).select(selectString);
  if (!app) {
    throw new AppError("App not found", 404);
  }
  return app;
};

export const createApp = async (appData) => {
  let app = null;
  await catchDuplicateError(async () => {
    const validatedData = performValidation(AppValidation, appData);
    validatedData.createdAt = new Date();
    app = new App(validatedData);
    await app.save();
  });
  return app;
};

export const updateApp = async (appId, updateData) => {
  let app = null;
  await catchDuplicateError(async () => {
    app = await getAppById(appId, true);
    const validatedData = performValidation(LooseAppValidation, updateData);
    Object.assign(app, validatedData);
    if (validatedData.password) {
      app.setPassword(updateData.password);
    }
    await app.save();
  });
  return app;
};
