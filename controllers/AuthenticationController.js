import AppError from "../utils/AppError.js";
import { getUserById, getUserByProperty } from "../crud/UserCrud.js";
import { jwt as jwtConfig } from "../config.js";
import { LooseUserValidation } from "../models/UserModel.js";
import performValidation from "../utils/performValidation.js";
import { signToken, decodeToken } from "../utils/JWTUtilityFunctions.js";
import { setAuthCookies } from "../utils/cookieUtilityFunctions.js";
import { send2FAEmail } from "../utils/mailer.js";
import Joi from "joi";

export const verifyCredentials = async (req, res, next) => {
  try {
    const credentials = performValidation(LooseUserValidation, req.body);
    if (!credentials || !credentials.email || !credentials.password) {
      throw new AppError("Email and password are required", 400);
    }
    const user = await getUserByProperty(
      { email: credentials.email },
      "+password +code2FA +last2FAGeneration +last2FAEmail"
    );
    const passwordValid = await user.checkPassword(credentials.password);
    if (!passwordValid) {
      throw new AppError("Invalid email or password", 401);
    }
    // if (user.verifiedEmail !== true) {
    //   throw new AppError("Email not verified", 403);
    // }
    req.user = user;
    req._used2FA = false;
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
      exp: new Date().getTime() / 1000 + jwtConfig.expiresIn,
    };
    const token = signToken(payload);
    setAuthCookies(res, token);
    res.status(200).json({
      message: "User signed in successfully",
      token: token,
      details: {
        _id: req.user._id,
        use2FA: req.user.use2FA,
        used2FA: req._used2FA,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const setDefaultToken = async (req, res, next) => {
  try {
    const newToken = req.body.token;
    if (!newToken) {
      throw new AppError("Token not provided", 400);
    }
    decodeToken(newToken);
    setAuthCookies(res, newToken);
    res.status(200).json({ message: "Default token changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const send2FACode = async (req, res, next) => {
  try {
    const user = await getUserById(
      req.user._id.toString(),
      "+email +code2FA +last2FAGeneration +last2FAEmail"
    );
    const now = new Date().getTime();
    let lastGenerated = user?.last2FAGeneration?.getTime();
    if (!lastGenerated) {
      lastGenerated = 0;
    }
    const codeExpired = lastGenerated < now - 15 * 60 * 1000;
    let lastSent = user?.last2FAEmail?.getTime();
    if (!lastSent) {
      lastSent = 0;
    }
    const emailExpired = lastSent < now - 1 * 60 * 1000;
    if (!emailExpired) {
      throw new AppError("Please wait before requesting another email", 400, {
        frequency: true,
      });
    }
    if (!user.code2FA || codeExpired) {
      user.code2FA = crypto.randomUUID().split("-")[0];
      user.last2FAGeneration = new Date();
    }
    user.last2FAEmail = new Date();
    await user.save();
    await send2FAEmail(user);
    res.status(200).json({ message: "Email with code sent" });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req, res, next) => {
  try {
    const codeValidator = Joi.object({
      code: Joi.string().required().length(8),
    });
    const { code } = performValidation(codeValidator, req.body);
    const user = await getUserById(
      req.user._id.toString(),
      "+code2FA +last2FAGeneration"
    );
    if (user.code2FA !== code) {
      throw new AppError("Invalid 2FA code", 401, { code: "Invalid 2FA Code" });
    }
    user.code2FA = null;
    await user.save();
    req._used2FA = true;
    next();
  } catch (error) {
    next(error);
  }
};
