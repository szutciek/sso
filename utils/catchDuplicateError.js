import AppError from "./AppError.js";

export default (fn) => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        if (error.code === 11000) {
          const keys = Object.keys(error.keyPattern);
          const obj = {};
          keys.forEach((key) => {
            obj[key] = `Please enter a different ${key} (duplicate)`;
          });
          reject(
            new AppError(
              `Please use a different ${keys.join(", ")} (duplicate)`,
              400,
              obj
            )
          );
        } else {
          reject(error);
        }
      });
  });
};
