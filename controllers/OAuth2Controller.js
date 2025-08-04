import * as AppCrud from "../crud/AppCrud.js";
import * as UserCrud from "../crud/UserCrud.js";
import { decodeToken } from "../utils/JWTUtilityFunctions.js";
import { OAuth2ParamValidator } from "../utils/OAuth2Validators.js";
import performValidation from "../utils/performValidation.js";
import { getUserById } from "../crud/UserCrud.js";
import AppError from "../utils/AppError.js";
import { signToken } from "../utils/JWTUtilityFunctions.js";
import { jwt as jwtConfig } from "../config.js";

export const handleAuthorizationRequest = async (req, res, next) => {
  try {
    const currentUrl = encodeURIComponent(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    if (!req.cookies || !req.cookies.token) {
      return res.redirect(`/authenticate?redirect=${currentUrl}`);
    }
    const decoded = decodeToken(req.cookies.token);
    req.user = await getUserById(decoded._id);
    req._used2FA = decoded.used2FA;
    const query = performValidation(OAuth2ParamValidator, req.query);
    const app = await AppCrud.getAppByProperty({ clientId: query.client_id });
    if (!app.redirectUris.includes(query.redirect_uri)) {
      return next(
        new AppError("Provided redirect uri not registered for app", 400)
      );
    }
    const appIdString = app._id.toString();
    const appTrusted = req.user.apps.some(
      (e) => e.app._id.toString() === appIdString && e.status === "trusted"
    );
    if (appTrusted !== true) {
      return res.redirect(`/trust/${app._id}?redirect=${currentUrl}`);
    }
    const payload = {
      _id: req.user._id,
      used2FA: req._used2FA,
      data: {},
      iat: new Date().getTime(),
      exp: new Date().getTime() / 1000 + jwtConfig.expiresIn, // Convert seconds to milliseconds
    };
    const userScope = await UserCrud.getUserById(
      req.user._id.toString(),
      `+${app.scope.join(" +")}`
    );
    app.scope.forEach((field) => {
      payload.data[field] = userScope[field];
    });
    const token = signToken(payload);
    const successQuery = encodeURIComponent(
      `access_token=${token}&state=${query.state}&scope=${app.scope.join(" ")}`
    );
    return res.redirect(`${query.redirect_uri}?${successQuery}`);
  } catch (error) {
    return next(error);
  }
};

// Not supported yet
export const handleTokenRequest = async (req, res) => {
  try {
    res.status(500).send("Internal Server Error");
  } catch (error) {
    console.error("Token request error:", error);
    res.status(500).send("Internal Server Error");
  }
};
