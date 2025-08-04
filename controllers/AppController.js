import * as AppCrud from "../crud/AppCrud.js";
import * as DeveloperCrud from "../crud/DeveloperCrud.js";
import AppError from "../utils/AppError.js";

export const createApp = async (req, res, next) => {
  try {
    const devId = req.user.developer._id.toString();
    req.body.developer = devId;
    const app = await AppCrud.createApp(req.body);
    const developer = await DeveloperCrud.getDeveloperById(devId);
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
    const app = await AppCrud.getAppById(req.params._id);
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
    const devId = req.user.developer._id.toString();
    const app = await AppCrud.getAppById(req.params._id);
    if (app.developer._id.toString() !== devId) {
      throw new AppError("Not allowed to delete this app", 403);
    }
    await AppCrud.deleteApp(app._id.toString());
    const developer = await DeveloperCrud.getDeveloperById(devId);
    developer.apps.pull({ app: app._id });
    await developer.save();
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
