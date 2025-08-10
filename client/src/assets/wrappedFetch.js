import lS from "@/store/localeStore";

export default (url, options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = {};
    }
    if (!options.headers["Content-Type"]) {
      options.headers["Content-Type"] = "application/json";
    }
    fetch(url, options)
      .then((response) => {
        if (response.status === 204) resolve(null);
        response
          .json()
          .then((data) => {
            if (!response.ok) reject(data);
            resolve(data);
          })
          .catch((error) => {
            console.warn(error.message);
            reject(lS.localeKeys.wrappedFetch.parsingError);
          });
      })
      .catch((error) => {
        console.warn(error.message);
        reject(lS.localeKeys.wrappedFetch.networkError);
      });
  });
};
