import mongoose from "mongoose";

import { db } from "./config.js";

const dbConn = db.authOn
  ? `mongodb://${db.user}:${db.pwd}@${db.host}:${db.port}/${db.name}${db.params}`
  : `mongodb://${db.host}${db.port}/${db.name}`;

mongoose.set("strictQuery", false);
mongoose
  .connect(dbConn)
  .then(() => {
    console.log(`Connected to ${db.name} database`);
  })
  .catch((err) => {
    console.log(err);
  });
