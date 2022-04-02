// const mongoose = require("mongoose");
import mongoose from "mongoose";

import ENV from "../config/env";

const connect = (): void => {
  mongoose.connect(`${ENV.MONGO.URI}/${ENV.MONGO.DB_NAME}`, (error) => {
    if (error) {
      return console.error(error);
    }

    console.log("Mongodb connected!");
  });
};

export default connect;
