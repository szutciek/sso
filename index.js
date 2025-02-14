import express from "express";
const app = express();

import "./database.js";
import apiRouter from "./api/index.js";
import safeErrorHandler from "./utils/safeErrorHandler.js";

import { dirname, server } from "./config.js";

app.get("/", (_, res) => res.sendFile(dirname + "/client/dist/index.html"));

app.use("/api", apiRouter);

app.use(express.static("client/dist/"));
app.use(express.static("public/"));

app.get("/*", (_, res) => res.sendFile(dirname + "/client/dist/index.html"));

app.use(safeErrorHandler);

app.listen(server.httpPort, () =>
  console.log(`Listening on port ${server.httpPort}`)
);
