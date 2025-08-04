import AppError from "../utils/AppError.js";
import { getUserByProperty } from "../bridges/UserBridge.js";
import { jwt as jwtConfig } from "../config.js";
import { LooseUserValidation } from "../models/UserModel.js";
import performValidation from "../utils/performValidation.js";
import { signToken } from "../utils/JWTUtilityFunctions.js";
import { setAuthCookies } from "../utils/cookieUtilityFunctions.js";

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
    req._used2FA = false;
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
      throw new AppError("Invalid 2FA code", 401, { includeCode: true });
    }
    req.user.code2FA = null;
    await req.user.save();
    req._used2FA = true;
    next();
  } catch (error) {
    next(error);
  }
};

export const generateToken = async (req, res, next) => {
  try {
    const payload = {
      _id: req.user._id,
      used2FA: req._used2FA,
      iat: new Date().getTime(),
      exp: new Date().getTime() / 1000 + jwtConfig.expiresIn, // Convert seconds to milliseconds
    };
    const token = signToken(payload);
    setAuthCookies(res, token);
    res.status(200).json({ message: "User signed in successfully" });
  } catch (error) {
    next(error);
  }
};
