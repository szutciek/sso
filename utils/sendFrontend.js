export default function sendFrontend(_, res) {
  res.sendFile(import.meta.dirname + "/client/dist/index.html");
}
