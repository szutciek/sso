import * as AppBridge from "../bridges/AppBridge.js";
import * as DeveloperBridge from "../bridges/DeveloperBridge.js";
import AppError from "../utils/AppError.js";

export const createApp = async (req, res, next) => {
  try {
    req.body.developer = req.user.developer._id.toString();
    const app = await AppBridge.createApp(req.body);
    const developer = await DeveloperBridge.getDeveloperById(
      req.body.developer
    );
    developer.apps.push({
      app: app._id,
      role: "developer",
    });
    await developer.save();
    res.status(200).json(app);
  } catch (err) {
    return next(err);
  }
};

export const getAppById = async (req, res, next) => {
  try {
    const app = await AppBridge.getAppById(req.params._id);
    res.status(200).json(app);
  } catch (err) {
    return next(err);
  }
};

export const updateAppById = async (req, res, next) => {
  try {
  } catch (err) {
    return next(err);
  }
};

export const deleteAppById = async (req, res, next) => {
  try {
    const app = await AppBridge.getAppById(req.params._id);
    if (app.developer._id.toString() === req.user.developer._id) {
      throw new AppError("Not allowed to delete this app", 403);
    }
    const result = await deleteAppById(app._id);
    // remove app id from developer also
    res.status(204).json({ message: "Deleted app" });
  } catch (err) {
    return next(err);
  }
};
