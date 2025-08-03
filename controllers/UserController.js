import * as UserBridge from "../bridges/UserBridge.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserBridge.getUserById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (req, res, next) => {
  try {
    const user = await UserBridge.updateUser(req.params._id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await UserBridge.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserBridge.getUserById(req.params._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await UserBridge.getUserByProperty({
      username: req.params.username,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const user = await UserBridge.getUserByProperty({
      email: req.params.email,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
