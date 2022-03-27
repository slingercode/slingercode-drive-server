const path = require("path");
const router = require("express").Router();

const { get, upload } = require("../api/aws");
const {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
} = require("../api/albums");

/**
 * General Routes
 */
router.get("/", (_, res) =>
  res
    .status(200)
    .sendFile(path.join(__dirname, "../..", "public", "index.html"))
);

router.get("/ping", (_, res) => res.status(200).send("pong"));

/**
 * AWS S3
 */
router.get("/aws/s3/get", get);
router.post("/aws/s3/upload", upload);

/**
 * Albums
 */
router.get("/albums", getAlbums);
router.get("/album", getAlbum);
router.post("/album", createAlbum);
router.put("/album", updateAlbum);

module.exports = router;
