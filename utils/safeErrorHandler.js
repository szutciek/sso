import sendFrontend from "./sendFrontend.js";
import { clearAuthCookies } from "../utils/cookieUtilityFunctions.js";

export default function safeErrorHandler(err, req, res, next) {
  if (err.code === 401) {
    clearAuthCookies(res);
  }
  if (err.isOperational) {
    if (req.accepts().includes("text/html")) {
      return sendFrontend(req, res);
    }
    if (req.accepts("json")) {
      const json = {
        status: "error",
        message: err.message,
      };
      if (err.apiInfo) json.details = err.apiInfo;
      return res.status(err.code).json(json);
    }
  }
  console.log(err);
  res.status(500).send("Something went wrong");
}
