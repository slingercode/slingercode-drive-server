const path = require("path");
const router = require("express").Router();

const aws = require("./aws");

/**
 * General Routes
 */
router.get("/", (_, res) =>
  res
    .status(200)
    .sendFile(path.join(__dirname, "../..", "public", "index.html"))
);

router.get("/ping", (_, res) => res.status(200).send("pong"));

// AWS
router.use("/aws", aws);

module.exports = router;
