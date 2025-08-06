import AppError from "../utils/AppError.js";
import { getUserById } from "../crud/UserCrud.js";
import { decodeToken } from "../utils/JWTUtilityFunctions.js";
import { clearAuthCookies } from "../utils/cookieUtilityFunctions.js";

const pathsOverride2FA = [
  "/authenticate/2fa",
  "/authenticate/2fa/request-code",
  "/api/users/me/email-provider",
];
const overrides2FARequirement = (path) => {
  return pathsOverride2FA.some((p) => p === path);
};

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Not authenticated", 401);
    }
    const decoded = decodeToken(token);
    req.user = await getUserById(decoded._id);
    req._used2FA = decoded.used2FA;
    const userRequires2FA = req.user.use2FA === true && req._used2FA !== true;
    if (userRequires2FA && !overrides2FARequirement(req.originalUrl)) {
      return next(
        new AppError("2FA login required", 401, {
          require2FA: true,
        })
      );
    }
    next();
  } catch (error) {
    clearAuthCookies(res);
    return next(error);
  }
};

export const restrictToDeveloper = async (req, res, next) => {
  try {
    if (!req.user.developer) {
      throw new AppError("You are not a developer", 403);
    }
    next();
  } catch (error) {
    return next(error);
  }
};
