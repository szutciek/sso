import { publicKey } from "../utils/rsaKeys.js";
import jwk from "pem-jwk";
const jwkKey = jwk.pem2jwk(publicKey);
jwkKey.kid = "key-v1";
const jwks = { keys: [jwkKey] };

import { Router } from "express";
const router = Router();

router.get("/.well-known/openid-configuration", (req, res) => {
  res.status(200).json({
    issuer: "https://sso.kanapka.eu",
    jwks_uri: "https://sso.kanapka.eu/.well-known/jwks.json",
    id_token_signing_alg_values_supported: ["RS256"],
  });
});

router.get("/.well-known/jwks.json", (req, res) => {
  res.json(jwks);
});

router.get("/.well-known/rsa.key.pub", (req, res) => {
  res.send(publicKey);
});

export default router;
