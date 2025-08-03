import { privateKey, publicKey } from "../utils/rsaKeys.js";
import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

export const signToken = (payload) => {
  try {
    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
    });
    return token;
  } catch (err) {
    throw err;
  }
};

export const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: "RS256",
    });
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token expired", 403);
    }
    if (err.name === "JsonWebTokenError") {
      throw new AppError("Token invalid", 403);
    }
    throw err;
  }
};
