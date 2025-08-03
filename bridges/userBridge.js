import {
  User,
  UserValidation,
  LooseUserValidation,
  publicFields,
  privateFields,
} from "../models/UserModel.js";
import performValidation from "../utils/performValidation.js";
import catchDuplicateError from "../utils/catchDuplicateError.js";
import AppError from "../utils/AppError.js";

export const getUserById = async (userId, selectPassword = false) => {
  const idValidationScheme = UserValidation.extract("_id");
  const validId = performValidation(idValidationScheme, userId);
  const selectString = `${selectPassword ? "+" : "-"}password`;
  const user = await User.findById(validId).select(selectString);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (req.user._id === user._id) {
    return user.stripTo(privateFields);
  } else {
    return user.stripTo(publicFields);
  }
};

export const getUserByProperty = async (property, selectPassword = false) => {
  const validated = performValidation(LooseUserValidation, property);
  const selectString = `${selectPassword ? "+" : "-"}password`;
  const user = await User.findOne(validated).select(selectString);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (req.user._id === user._id) {
    return user.stripTo(privateFields);
  } else {
    return user.stripTo(publicFields);
  }
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
  return user.stripTo(privateFields);
};

export const updateUser = async (userId, updateData) => {
  let user = null;
  await catchDuplicateError(async () => {
    user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const validatedData = performValidation(LooseUserValidation, updateData);
    Object.assign(user, validatedData);
    if (validatedData.password) {
      user.setPassword(updateData.password);
    }
    await user.save();
  });
  return user.stripTo(privateFields);
};
