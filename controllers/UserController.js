import * as UserCrud from "../crud/UserCrud.js";
import * as DeveloperController from "./DeveloperController.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserById(req.user._id.toString());
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (req, res, next) => {
  try {
    const user = await UserCrud.updateUser(req.params._id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteCurrentUser = async (req, res, next) => {
  try {
    if (req.user.developer) {
      const developerId = req.user.developer._id.toString();
      await DeveloperController.handleDeveloperDeletion(developerId);
    }
    await req.user.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await UserCrud.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserById(req.params._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserByProperty({
      username: req.params.username,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserByProperty({
      email: req.params.email,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const domainMap = {
  "gmail.com": "https://mail.google.com/",
  "googlemail.com": "https://mail.google.com/",
  "yahoo.com": "https://mail.yahoo.com/",
  "ymail.com": "https://mail.yahoo.com/",
  "outlook.com": "https://outlook.live.com/mail/",
  "hotmail.com": "https://outlook.live.com/mail/",
  "live.com": "https://outlook.live.com/mail/",
  "msn.com": "https://outlook.live.com/mail/",
  "aol.com": "https://mail.aol.com/",
  "icloud.com": "https://www.icloud.com/mail",
  "me.com": "https://www.icloud.com/mail",
  "mac.com": "https://www.icloud.com/mail",
  "protonmail.com": "https://mail.proton.me/",
  "gmx.com": "https://www.gmx.com/",
  "zoho.com": "https://mail.zoho.com/",
  "yandex.com": "https://mail.yandex.com/",
  "mail.com": "https://www.mail.com/",
  "comcast.net": "https://xfinity.comcast.net/",
  "verizon.net": "https://webmail.verizon.com/",
  "att.net": "https://currently.att.yahoo.com/",
  "mail.ru": "https://e.mail.ru/",
  "qq.com": "https://mail.qq.com/",
  "naver.com": "https://mail.naver.com/",
  "daum.net": "https://mail.daum.net/",
  "hanmail.net": "https://mail.daum.net/",

  "wp.pl": "https://poczta.wp.pl/",
  "o2.pl": "https://poczta.o2.pl/",
  "interia.pl": "https://poczta.interia.pl/",
  "onet.pl": "https://poczta.onet.pl/",
  "gazeta.pl": "https://poczta.gazeta.pl/",
  "tlen.pl": "https://poczta.o2.pl/",
  "go2.pl": "https://poczta.o2.pl/",
  "home.pl": "https://poczta.home.pl/",
  "autograf.pl": "https://poczta.interia.pl/",
  "buziaczek.pl": "https://poczta.interia.pl/",
  "poczta.fm": "https://poczta.fm/",
};

export const getCurrentUserEmailProvider = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserById(req.user._id.toString(), "+email");
    const domain = user.email.split("@")[1];
    const provider = domainMap[domain];
    if (!provider) res.status(404);
    res.status(200).json({ provider });
  } catch (err) {
    next(err);
  }
};
