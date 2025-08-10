import { Router } from "express";
const router = Router();

import { authenticate } from "../middleware/ApiAuthenticationMiddleware.js";
import * as UserController from "../controllers/UserController.js";
import * as UserPasswordController from "../controllers/UserPasswordController.js";

router
  .route("/me/email-provider")
  .get(authenticate, UserController.getCurrentUserEmailProvider);

router
  .route("/me")
  .get(authenticate, UserController.getCurrentUser)
  .put(authenticate, UserController.updateCurrentUser)
  .delete(authenticate, UserController.deleteCurrentUser);

router.post("/initiate-password-reset", UserPasswordController.initiateReset);
router.post("/complete-password-reset", UserPasswordController.completeReset);

router.route("/").post(UserController.createUser);

router.route("/:_id").get(UserController.getUserById);

router.route("/username/:username").get(UserController.getUserByUsername);

router.route("/email/:email").get(authenticate, UserController.getUserByEmail);

export default router;
