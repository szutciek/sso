import { Router } from "express";
const router = Router();

import {
  verifyCredentials,
  generateToken,
  verify2FA,
  send2FACode,
  setDefaultToken,
} from "../controllers/AuthenticationController.js";
import { authenticate } from "../middleware/ApiAuthenticationMiddleware.js";

router.post("/", verifyCredentials, generateToken);
router.post("/2fa", authenticate, verify2FA, generateToken);
router.post("/2fa/request-code", authenticate, send2FACode);

// Authentication should not be necessary, since validity of token gets checked
router.post("/set-default-token", setDefaultToken);
// router.post("/set-default-token", authenticate, setDefaultToken);

export default router;
