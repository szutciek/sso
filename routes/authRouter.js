import { Router } from "express";
const router = Router();

import {
  verifyCredentials,
  generateToken,
} from "../controllers/AuthenticationController.js";

router.post("/", verifyCredentials, generateToken);

export default router;
