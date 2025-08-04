import * as DeveloperBridge from "../bridges/DeveloperBridge.js";
import AppError from "../utils/AppError.js";

export const getDeveloperById = async (req, res, next) => {
  try {
    const developer = await DeveloperBridge.getDeveloperById(
      req.params._id.toString()
    );
    res.status(200).json(developer);
  } catch (err) {
    return next(err);
  }
};

export const createDeveloper = async (req, res, next) => {
  try {
    if (req.user.developer) {
      throw new AppError("You are a developer", 400);
    }
    const developer = await DeveloperBridge.createDeveloper({
      user: req.user._id.toString(),
    });
    req.user.developer = developer._id;
    await req.user.save();
    res.status(200).json(developer);
  } catch (err) {
    return next(err);
  }
};

export const deleteDeveloper = async (req, res, next) => {
  try {
    throw new AppError("Not supported yet", 500);
    // remove reference from user
    // remove all apps
    // delete developer
  } catch (err) {
    return next(err);
  }
};
