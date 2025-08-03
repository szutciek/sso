export default function sendFrontend(_, res) {
  res.sendFile(dirname + "/client/dist/index.html");
}
