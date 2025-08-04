import { Router } from "express";
const router = Router();

import {
  authenticate,
  restrictToDeveloper,
} from "../middleware/ApiAuthenticationMiddleware.js";
import * as AppController from "../controllers/AppController.js";

router
  .route("/")
  .post(authenticate, restrictToDeveloper, AppController.createApp);

router
  .route("/:_id")
  .get(AppController.getAppById)
  .put(authenticate, restrictToDeveloper, AppController.updateAppById)
  .delete(authenticate, restrictToDeveloper, AppController.deleteAppById);

export default router;
