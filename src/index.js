require("dotenv").config();

const express = require("express");
const cors = require("cors");

const router = require("./routes");
const mongoose = require("./lib/mongoose");

const { APP_PORT, APP_CORS_ORIGINS } = process.env;
const corsOrigins = APP_CORS_ORIGINS.split(",");

const app = express();

/**
 * Static
 */
app.use("/public", express.static("public"));

/**
 * Middlewares
 */
app.use(cors({ origin: corsOrigins }));
app.use(express.json());

/**
 * Routes
 */
app.use(router);

/**
 * MongoDB
 */
mongoose.connect();

app.listen(APP_PORT, () => console.log(`App listening on port: ${APP_PORT}`));
