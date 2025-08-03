Object.prototype.stripTo = function (properties) {
  const result = {};
  properties.forEach((property) => {
    if (this[property] !== undefined) {
      result[property] = this[property];
    }
  });
  return result;
};
