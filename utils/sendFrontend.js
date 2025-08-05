import { dirname } from "../config.js";

export default function sendFrontend(req, res) {
  res.sendFile(dirname + "/client/dist/index.html");
}
