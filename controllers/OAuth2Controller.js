import { privateKey, publicKey } from "../utils/rsaKeys.js";

/*
Preferred parameters:
 - response_type: token (code, token)

*/

// When the user accesses the authorization endpoint, this function will be called
export const handleAuthorizationRequest = async (req, res, next) => {
  try {
    // Check if the user website has cookies set
    // If the user is not logged in, send the frontend
    if (!req.cookies || !req.cookies.token) {
      return next();
    }

    // depending on the state of the app,
    // provide different data in the token
    ////////
    // const token = jwt.sign(payload, privateKey, {
    //   algorithm: "RS256",
    // });

    // // decode tokem

    // const decoded = jwt.verify(token, publicKey, {
    //   algorithms: "RS256",
    // });
    ////////

    const { response_type, client_id, redirect_uri, scope } = req.query;
    console.log(response_type, client_id, redirect_uri, scope);
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// When the resource server requests token for code
export const handleTokenRequest = async (req, res) => {
  try {
    const { grant_type, code, client_id, client_secret, redirect_uri } =
      req.body;
    // Logic for handling token requests
    // This could involve validating client credentials, issuing tokens, etc.
    res.status(200).send("Token issued successfully");
  } catch (error) {
    console.error("Token request error:", error);
    res.status(500).send("Internal Server Error");
  }
};
