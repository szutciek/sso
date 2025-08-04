import { Router } from "express";
const router = Router();

import {
  authenticate,
  restrictToDeveloper,
} from "../middleware/ApiAuthenticationMiddleware.js";
import * as AppController from "../controllers/AppController.js";
import appTrustRouter from "./appTrustApiRouter.js";

router
  .route("/")
  .post(authenticate, restrictToDeveloper, AppController.createApp);

router.use("/trust", authenticate, appTrustRouter);

router
  .route("/:_id")
  .get(AppController.getAppById)
  .put(authenticate, restrictToDeveloper, AppController.updateAppById)
  .delete(authenticate, restrictToDeveloper, AppController.deleteAppById);

export default router;
