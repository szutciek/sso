import AppError from "../utils/AppError.js";
import { getUserById } from "../bridges/UserBridge.js";
import { decodeToken } from "../utils/JWTUtilityFunctions.js";
import { clearAuthCookies } from "../utils/cookieUtilityFunctions.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Not authenticated", 401);
    }
    const decoded = decodeToken(token);
    req.user = await getUserById(decoded._id);
    next();
  } catch (error) {
    clearAuthCookies(res);
    return next(error);
  }
};
