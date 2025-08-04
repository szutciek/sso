import { Router } from "express";
const router = Router();

import {
  verifyCredentials,
  verify2FA,
  generateToken,
} from "../controllers/AuthenticationController.js";

router.post("/", verifyCredentials, verify2FA, generateToken);

export default router;
