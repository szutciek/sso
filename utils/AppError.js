export default class AppError extends Error {
  apiInfo = null;

  constructor(message, statusCode, apiInfo) {
    if (!message || !statusCode) {
      throw new Error("Status code is required for AppError");
    }
    if (typeof message !== "string") {
      throw new Error("Message must be a string");
    }
    if (typeof statusCode !== "number") {
      throw new Error("Status code must be a number");
    }
    if (apiInfo && typeof apiInfo !== "object") {
      throw new Error("API info must be an object");
    }

    super(message);

    this.code = statusCode;
    this.apiInfo = apiInfo;
    this.isOperational = true;
  }
}
