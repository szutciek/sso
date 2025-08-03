import fs from "fs";

export const privateKey = fs.readFileSync("./keys/rsa.key", "utf8");
export const publicKey = fs.readFileSync("./keys/rsa.key.pub", "utf8");
