import path from "path";
import { Request, Response, Router } from "express";

import me from "../api/me";
import { get, upload } from "../api/aws";
import { createAlbum, getAlbum, getAlbums, updateAlbum } from "../api/albums";

import authorizeAccessToken from "../middlewares/authorization";

const router: Router = Router();

/**
 * General Routes
 */
router.get("/", (_: Request, res: Response) =>
  res
    .status(200)
    .sendFile(path.join(__dirname, "../..", "public", "index.html")),
);

router.get("/ping", (_: Request, res: Response) =>
  res.status(200).send("pong"),
);

/**
 * Authorization token
 */
router.use(authorizeAccessToken);

router.get("/me", me);

/**
 * Albums
 */
router.get("/albums", getAlbums);
router.get("/album", getAlbum);
router.post("/album", createAlbum);
router.put("/album", updateAlbum);

/**
 * AWS S3
 */
router.get("/aws/s3/get", get);
router.post("/aws/s3/upload", upload);

export default router;
