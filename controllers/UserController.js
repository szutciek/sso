import * as UserCrud from "../crud/UserCrud.js";
import * as DeveloperController from "./DeveloperController.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserById(req.user._id.toString());
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (req, res, next) => {
  try {
    const user = await UserCrud.updateUser(req.params._id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteCurrentUser = async (req, res, next) => {
  try {
    if (req.user.developer) {
      const developerId = req.user.developer._id.toString();
      await DeveloperController.handleDeveloperDeletion(developerId);
    }
    await req.user.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await UserCrud.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserById(req.params._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserByProperty({
      username: req.params.username,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserByProperty({
      email: req.params.email,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
