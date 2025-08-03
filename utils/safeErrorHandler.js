export default function safeErrorHandler(err, req, res, next) {
  if (err.isOperational) {
    const json = {
      status: "error",
      message: err.message,
    };
    if (err.apiInfo) json.apiInfo = err.apiInfo;
    return res.status(err.code).json(json);
  }
  console.log(err);
  res.status(500).send("Something went wrong");
}
