import { decodeToken } from "../utils/JWTUtilityFunctions.js";
import { OAuth2ParamValidator } from "../utils/OAuth2Validators.js";
import performValidation from "../utils/performValidation.js";
import { getUserById } from "../crud/UserCrud.js";

export const handleAuthorizationRequest = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return next();
    }
    const decoded = decodeToken(req.cookies.token);
    req.user = await getUserById(decoded._id);
    const query = performValidation(OAuth2ParamValidator, req.query);
    console.log(query);
    // get user data
    // get app data
    // check if user accepted app (shared data requested)
    // generate new token and redirect client with it in url
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
