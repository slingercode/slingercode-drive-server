require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const { APP_PORT, APP_CORS_ORIGINS } = process.env;
const corsOrigins = APP_CORS_ORIGINS.split(",");

app.use(cors({ origin: corsOrigins }));
app.use("/public", express.static("public"));

app.get("/", (_, res) =>
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"))
);

app.get("/ping", (_, res) => res.status(200).send("pong"));

app.listen(APP_PORT, () => console.log(`App listening on port: ${APP_PORT}`));
