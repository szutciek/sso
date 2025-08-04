import * as AppCrud from "../crud/AppCrud.js";

export const getUsersTrustedList = async (req, res, next) => {
  try {
    res.status(200).json(req.user.apps);
  } catch (error) {
    next(error);
  }
};

export const getRelevantAppInfo = async (req, res, next) => {
  try {
    const app = await AppCrud.getAppById(req.params._id);
    res.status(200).json(app);
  } catch (error) {
    next(error);
  }
};

export const grantTrustApp = async (req, res, next) => {
  try {
    const entry = req.user.apps.find(
      (e) => e.app._id.toString() === req.params._id
    );
    const app = await AppCrud.getAppById(req.params._id);
    if (entry) {
      entry.status = "trusted";
    } else {
      req.user.apps.push({ app: req.params._id, status: "trusted" });
      app.numberOfUsers++;
      await app.save();
    }
    await req.user.save();

    res.status(200).json({ message: "Successfully granted trust in app" });
  } catch (error) {
    next(error);
  }
};

export const revokeTrustApp = async (req, res, next) => {
  try {
    const entry = req.user.apps.find(
      (e) => e.app._id.toString() === req.params._id
    );
    const app = await AppCrud.getAppById(req.params._id);
    if (entry) {
      entry.status = "revoked";
    } else {
      req.user.apps.push({ app: req.params._id, status: "revoked" });
      app.numberOfUsers--;
      await app.save();
    }
    await req.user.save();
    res.status(200).json({ message: "Successfully revoked trust in app" });
  } catch (error) {
    next(error);
  }
};
