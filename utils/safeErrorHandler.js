export default function safeErrorHandler(err, req, res, next) {
  console.log(err);
  // TODO: Check if the error is safe to send or not
  res.status(500).send("Something went wrong");
}
