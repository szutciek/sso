import {
  User,
  UserValidation,
  LooseUserValidation,
} from "../models/UserModel.js";
import performValidation from "../utils/performValidation.js";
import catchDuplicateError from "../utils/catchDuplicateError.js";
import AppError from "../utils/AppError.js";

export const getUserById = async (userId, selectString) => {
  const idValidationScheme = UserValidation.extract("_id");
  const validId = performValidation(idValidationScheme, userId);
  const user = await User.findById(validId).select(selectString);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const getUserByProperty = async (property, selectString) => {
  const validated = performValidation(LooseUserValidation, property);
  const user = await User.findOne(validated).select(selectString);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const createUser = async (userData) => {
  let user = null;
  await catchDuplicateError(async () => {
    const validatedData = performValidation(UserValidation, userData);
    validatedData.createdAt = new Date();
    user = new User(validatedData);
    user.setPassword(validatedData.password);
    await user.save();
  });
  return user;
};

export const updateUser = async (userId, updateData) => {
  let user = null;
  await catchDuplicateError(async () => {
    user = await getUserById(userId, true);
    const validatedData = performValidation(LooseUserValidation, updateData);
    Object.assign(user, validatedData);
    if (validatedData.password) {
      user.setPassword(updateData.password);
    }
    await user.save();
  });
  return user;
};
