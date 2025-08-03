import AppError from "./AppError.js";

const convertJoiError = (error) => {
  const obj = {};
  error.details.forEach((detail) => {
    obj[detail.path[0]] = detail.message;
  });
  return obj;
};

const performValidation = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new AppError("Validation failed", 400, convertJoiError(error));
  }
  return value;
};

export default performValidation;
