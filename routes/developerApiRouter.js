import { Router } from "express";
const router = Router();

import {
  authenticate,
  restrictToDeveloper,
} from "../middleware/ApiAuthenticationMiddleware.js";
import * as DeveloperController from "../controllers/DeveloperController.js";

router
  .route("/")
  .post(authenticate, DeveloperController.createDeveloper)
  .delete(
    authenticate,
    restrictToDeveloper,
    DeveloperController.deleteDeveloper
  );

router.route("/:_id").get(DeveloperController.getDeveloperById);

export default router;
