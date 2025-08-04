import * as DeveloperCrud from "../crud/DeveloperCrud.js";
import * as UserCrud from "../crud/UserCrud.js";
import * as AppCrud from "../crud/AppCrud.js";
import AppError from "../utils/AppError.js";

export const getDeveloperById = async (req, res, next) => {
  try {
    const developer = await DeveloperCrud.getDeveloperById(
      req.params._id.toString()
    );
    res.status(200).json(developer);
  } catch (err) {
    return next(err);
  }
};

export const getCurrentDeveloper = async (req, res, next) => {
  try {
    const developer = await req.user.developer.populate("user");
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
    const developer = await DeveloperCrud.createDeveloper({
      user: req.user._id.toString(),
    });
    req.user.developer = developer._id;
    await req.user.save();
    res.status(200).json(developer);
  } catch (err) {
    return next(err);
  }
};

export const handleDeveloperDeletion = async (devId) => {
  const developer = await DeveloperCrud.getDeveloperById(devId);
  for (let i = 0; i < developer.apps.length; i++) {
    if (developer.apps[i].role === "developer") {
      await AppCrud.deleteApp(developer.apps[i].app._id);
    }
  }
  const user = await UserCrud.getUserById(developer.user._id.toString());
  user.developer = undefined;
  await user.save();
  await DeveloperCrud.deleteDeveloper(developer._id.toString());
};

export const deleteDeveloper = async (req, res, next) => {
  try {
    const developerId = req.user.developer._id.toString();
    await handleDeveloperDeletion(developerId);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
