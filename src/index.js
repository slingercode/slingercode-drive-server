require("dotenv").config();

const express = require("express");
const cors = require("cors");

const router = require("./routes");

const { APP_PORT, APP_CORS_ORIGINS } = process.env;
const corsOrigins = APP_CORS_ORIGINS.split(",");

const app = express();

/**
 * Middlewares
 */
app.use(cors({ origin: corsOrigins }));
app.use("/public", express.static("public"));

/**
 * Routes
 */
app.use(router);

app.listen(APP_PORT, () => console.log(`App listening on port: ${APP_PORT}`));
