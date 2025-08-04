import { Router } from "express";
const router = Router();

import * as AppTrustController from "../controllers/AppTrustController.js";

router.route("/").get(AppTrustController.getUsersTrustedList);

router
  .route("/:_id")
  .get(AppTrustController.getRelevantAppInfo)
  .post(AppTrustController.grantTrustApp)
  .delete(AppTrustController.revokeTrustApp);

export default router;
