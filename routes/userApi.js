import { Router } from "express";
const router = Router();

import {
  authenticate,
  restrictToAuthenticated,
  restrictToSelf,
} from "../controllers/AuthenticationController.js";

import * as UserBridge from "../bridges/UserBridge.js";

router
  .route("/me", authenticate, restrictToAuthenticated, restrictToSelf)
  .get(async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await UserBridge.getUserById(req.user._id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const user = await UserBridge.updateUser(req.params._id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

router.route("/").post(async (req, res, next) => {
  try {
    const user = await UserBridge.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:_id", async (req, res, next) => {
  try {
    const user = await UserBridge.getUserById(req.params._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/name/:name", async (req, res, next) => {
  try {
    const user = await UserBridge.getUserByProperty({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router
  .route("/email/:email", authenticate, restrictToAuthenticated, restrictToSelf)
  .get(async (req, res, next) => {
    try {
      const user = await UserBridge.getUserByProperty({
        email: req.params.email,
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

export default router;
