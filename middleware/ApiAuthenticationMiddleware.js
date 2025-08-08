import AppError from "../utils/AppError.js";
import { getUserById } from "../crud/UserCrud.js";
import { decodeToken } from "../utils/JWTUtilityFunctions.js";

const requestsOverride2FA = [
  "post:/authenticate/2fa",
  "post:/authenticate/2fa/request-code",
  "get:/api/users/me",
  "get:/api/users/me/email-provider",
];
const overrides2FARequirement = (method, path) => {
  method = method.toLowerCase();
  return requestsOverride2FA.some((r) => {
    const [m, p] = r.split(":");
    return m === method && p === path;
  });
};

export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      throw new AppError("Not authenticated", 400);
    }
    const decoded = decodeToken(token);
    req.user = await getUserById(decoded._id);
    req._used2FA = decoded.used2FA;
    const userRequires2FA = req.user.use2FA === true && req._used2FA !== true;
    if (
      userRequires2FA &&
      !overrides2FARequirement(req.method, req.originalUrl)
    ) {
      return next(
        new AppError("2FA login required", 403, {
          require2FA: true,
        })
      );
    }
    next();
  } catch (error) {
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
