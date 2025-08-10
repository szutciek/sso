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
  const user = await User.findById(validId)
    .select(selectString)
    .populate([
      {
        path: "apps.app",
        populate: { path: "developer", populate: { path: "user" } },
      },
      { path: "developer", populate: { path: "apps.app" } },
    ]);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const getUserByProperty = async (property, selectString) => {
  const validated = performValidation(LooseUserValidation, property);
  const user = await User.findOne(validated)
    .select(selectString)
    .populate([
      {
        path: "apps.app",
        populate: { path: "developer", populate: { path: "user" } },
      },
      { path: "developer", populate: { path: "apps.app" } },
    ]);
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
    await user.save();
  });
  return user;
};

export const updateUser = async (userId, updateData) => {
  let user = null;
  await catchDuplicateError(async () => {
    user = await getUserById(userId);
    const validatedData = performValidation(LooseUserValidation, updateData);
    delete validatedData.password;
    Object.assign(user, validatedData);
    await user.save();
  });
  return user;
};

export const updateUserPassword = async (userId, updateData) => {
  let user = null;
  await catchDuplicateError(async () => {
    user = await getUserById(userId);
    const validatedData = performValidation(LooseUserValidation, updateData);
    user.password = validatedData.password;
    await user.save();
  });
  return user;
};

export const updateMany = async (query, change) => {
  let users = null;
  await catchDuplicateError(async () => {
    users = await User.updateMany(query, change);
  });
  return users;
};
