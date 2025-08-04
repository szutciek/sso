import { Router } from "express";
const router = Router();

import {
  verifyCredentials,
  verify2FA,
  generateToken,
  setDefaultToken,
} from "../controllers/AuthenticationController.js";
import { authenticate } from "../middleware/ApiAuthenticationMiddleware.js";

router.post("/", verifyCredentials, verify2FA, generateToken);

router.post("/set-default-token", authenticate, setDefaultToken);

export default router;
