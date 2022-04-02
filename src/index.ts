import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";

import ENV from "./config/env";
import router from "./routes";
import initMongo from "./lib/mongoose";

const app: Express = express();

/**
 * Static
 */
app.use("/public", express.static("public"));

/**
 * Middewares
 */
app.use(cors({ origin: ENV.APP.CORS_ORIGINS.split(",") }));
app.use(express.json());

/**
 * Routes
 */
app.use(router);

/**
 * Initialization
 */
initMongo();
app.listen(ENV.APP.PORT, () => console.log(`Server listening on: ${ENV.APP.PORT}`));
