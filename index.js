import express from "express";
import cookieParser from "cookie-parser";
const app = express();

import "./database.js";
import rateLimit from "express-rate-limit";
import apiRouter from "./routes/apiRouter.js";
import authRouter from "./routes/authRouter.js";
import oAuth2KeyRouter from "./routes/oAuth2KeyRouter.js";
import { handleAuthorizationRequest } from "./controllers/OAuth2Controller.js";
import sendFrontend from "./utils/sendFrontend.js";
import safeErrorHandler from "./utils/safeErrorHandler.js";

import { server } from "./config.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again in 15 minutes",
});

app.get("/", sendFrontend);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(oAuth2KeyRouter);

app.use("/api", limiter, apiRouter);
app.use("/authenticate", authRouter);

app.get("/authorize", handleAuthorizationRequest, sendFrontend);
// app.post("/token", handleTokenRequest);

app.use(express.static("client/dist/"));
app.use(express.static("public/"));

app.get("/*", sendFrontend);

app.use(safeErrorHandler);

app.listen(server.httpPort, () =>
  console.log(`Listening on port ${server.httpPort}`)
);
