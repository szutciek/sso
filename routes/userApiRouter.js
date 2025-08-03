import { Router } from "express";
const router = Router();

import {
  authenticate,
  restrictToAuthenticated,
  restrictToSelf,
} from "../middleware/ApiAuthenticationMiddleware.js";
import * as UserController from "../controllers/UserController.js";

router
  .route("/me")
  .get(
    authenticate,
    restrictToAuthenticated,
    restrictToSelf,
    UserController.getCurrentUser
  )
  .put(
    authenticate,
    restrictToAuthenticated,
    restrictToSelf,
    UserController.updateCurrentUser
  );

router.route("/").post(UserController.createUser);

router.route("/:_id").get(UserController.getUserById);

router.route("/username/:username").get(UserController.getUserByUsername);

router
  .route("/email/:email")
  .get(
    authenticate,
    restrictToAuthenticated,
    restrictToSelf,
    UserController.getUserByEmail
  );

export default router;
