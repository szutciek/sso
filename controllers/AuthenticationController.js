import AppError from "../utils/AppError.js";
import { getUserByProperty } from "../bridges/UserBridge.js";
import jwt from "jsonwebtoken";
import { privateKey } from "../utils/rsaKeys.js";
import { jwt as jwtConfig } from "../config.js";
import { LooseUserValidation } from "../models/UserModel.js";
import performValidation from "../utils/performValidation.js";

export const send2FACode = async (user) => {
  const code = crypto.randomUUID().split("-")[0];
  user.code2FA = code;
  await user.save();
  console.log(`Sending 2FA code "${code}" to email: ${user.email}`);
  // Implement actual email sending logic here
};

export const verifyCredentials = async (req, res, next) => {
  try {
    const credentials = performValidation(LooseUserValidation, req.body);
    if (!credentials || !credentials.email || !credentials.password) {
      throw new AppError("Email and password are required", 400);
    }
    const user = await getUserByProperty(
      { email: credentials.email },
      "+password +code2FA"
    );
    const passwordValid = await user.checkPassword(credentials.password);
    if (!passwordValid) {
      throw new AppError("Invalid email or password", 401);
    }
    // if (user.verifiedEmail !== true) {
    //   throw new AppError("Email not verified", 403);
    // }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req, res, next) => {
  try {
    if (!req.user.use2FA) {
      return next();
    }
    const codeValidator = Joi.object({
      code: Joi.string().required().length(8),
    });
    const code = performValidation(codeValidator, {
      code2FA: req.body.code2FA,
    });
    if (req.user.code2FA !== code) {
      throw new AppError("Invalid 2FA code", 401);
    }
    req.user.code2FA = null;
    await req.user.save();
    next();
  } catch (error) {
    next(error);
  }
};

export const generateToken = async (req, res, next) => {
  try {
    const payload = {
      _id: req.user._id,
      username: req.user.username,
      iat: new Date().getTime(),
      exp: new Date().getTime() / 1000 + jwtConfig.expiresIn, // Convert seconds to milliseconds
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
    });

    console.log(token);

    res.status(200).json({ message: "User signed in successfully" });
  } catch (error) {
    next(error);
  }
};
