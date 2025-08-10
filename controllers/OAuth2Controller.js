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
    let sendAppOnFail = req.accepts().includes("text/html");
    const currentUrl = encodeURIComponent(req.originalUrl);
    // const currentUrl = encodeURIComponent(
    //   req.protocol + "://" + req.get("host") + req.originalUrl
    // );
    if (!req.cookies || !req.cookies.token) {
      req._targetAppPath = `/authenticate?redirect=${currentUrl}`;
      if (sendAppOnFail) return next();
      return next(
        new AppError("Not authenticated", 403, {
          redirect: req._targetAppPath,
        })
      );
    }
    const decoded = decodeToken(req.cookies.token);
    req.user = await getUserById(decoded._id, "+passwordLastChanged");
    const pwdChanged = new Date(req.user.passwordLastChanged).getTime();
    if (pwdChanged > decoded.iat) {
      throw new AppError("Password changed since last sign in", 401, {
        redirect: req._targetAppPath,
      });
    }
    req._used2FA = decoded.used2FA;
    if (req.user.use2FA === true && req._used2FA !== true) {
      req._targetAppPath = `/authenticate/2fa?redirect=${currentUrl}`;
      if (sendAppOnFail) return next();
      return next(
        new AppError("2FA login required", 403, {
          require2FA: true,
          redirect: req._targetAppPath,
        })
      );
    }
    const query = performValidation(OAuth2ParamValidator, req.query);
    const app = await AppCrud.getAppByProperty({ clientId: query.client_id });
    if (app.require2FA === true && req._used2FA !== true) {
      req._targetAppPath = `/authenticate/2fa?redirect=${currentUrl}`;
      if (sendAppOnFail) return next();
      return next(
        new AppError("2FA login required to access app", 403, {
          require2FA: true,
          redirect: req._targetAppPath,
        })
      );
    }
    req._inDevelopment = false;
    if (!app.redirectUris.includes(query.redirect_uri)) {
      if (!app.redirectUrisDevelopment.includes(query.redirect_uri)) {
        return next(
          new AppError("Provided redirect uri not registered for app", 400)
        );
      }
      req._inDevelopment = true;
    }
    const appIdString = app._id.toString();
    const appTrusted = req.user.apps.some(
      (e) => e.app._id.toString() === appIdString && e.status === "trusted"
    );
    if (appTrusted !== true) {
      req._targetAppPath = `/trust/${app._id}?redirect=${currentUrl}`;
      if (sendAppOnFail) return next();
      return next(
        new AppError("App not trusted by user", 403, {
          redirect: req._targetAppPath,
        })
      );
    }
    const payload = {
      authority: "sso.kanapka.eu",
      client_id: app.clientId,
      used2FA: req._used2FA,
      user: {
        uuid: req.user._id.toString(),
      },
      iat: new Date().getTime(),
      exp: new Date().getTime() / 1000 + jwtConfig.expiresIn,
    };
    if (req._inDevelopment === true) {
      payload.developmentOnly = true;
    }
    const userScope = await UserCrud.getUserById(
      req.user._id.toString(),
      `+${app.scope.join(" +")}`
    );
    app.scope.forEach((field) => {
      payload.user[field] = userScope[field];
    });
    const token = signToken(payload);
    const successQuery = `access_token=${token}&state=${
      query.state
    }&scope=${app.scope.join(" ")}`;
    if (sendAppOnFail) {
      return res.redirect(`${query.redirect_uri}?${successQuery}`);
    } else {
      res.status(200).json({
        message: "Successfully obtained access token",
        redirect: `${query.redirect_uri}?${successQuery}`,
      });
    }
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
