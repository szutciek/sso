import { jwt as jwtConfig } from "../config.js";

export const setAuthCookies = (res, token) => {
  const cookieConf = {
    httpOnly: false,
    secure: true,
    sameSite: "Strict",
    maxAge: jwtConfig.internalExpiresIn * 1000,
  };

  res.cookie("isLoggedIn", "true", cookieConf);
  res.cookie("token", token, cookieConf);
};

export const clearAuthCookies = (res) => {
  res.cookie("isLoggedIn", "false", {
    httpOnly: false,
    secure: true,
    sameSite: "Strict",
  });
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
};
