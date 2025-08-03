import express from "express";
import cookieParser from "cookie-parser";
const app = express();

import "./database.js";
import apiRouter from "./routes/indexApi.js";
import {
  handleAuthorizationRequest,
  handleTokenRequest,
} from "./controllers/OAuth2Controller.js";
import sendFrontend from "./utils/sendFrontend.js";
import "./utils/ObjectPrototypeMethods.js";
import safeErrorHandler from "./utils/safeErrorHandler.js";

import { dirname, server } from "./config.js";

app.get("/", sendFrontend);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiRouter);

app.get("/authorize", handleAuthorizationRequest, sendFrontend);
app.post("/token", handleTokenRequest);

app.use(express.static("client/dist/"));
app.use(express.static("public/"));

app.get("/*", sendFrontend);

app.use(safeErrorHandler);

app.listen(server.httpPort, () =>
  console.log(`Listening on port ${server.httpPort}`)
);
