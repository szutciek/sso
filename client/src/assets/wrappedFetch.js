export default (url, options) => {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        response
          .json()
          .then((data) => {
            if (!response.ok) reject(data);
            resolve(data);
          })
          .catch((error) => {
            console.warn(error.message);
            reject("Response parsing error");
          });
      })
      .catch((error) => {
        console.warn(error.message);
        reject("Network error");
      });
  });
};
