import path from "path";
import { Request, Response, Router } from "express";

import { get, upload } from "../api/ts/aws";
import {
  createAlbum,
  getAlbum,
  getAlbums,
  updateAlbum,
} from "../api/ts/albums";

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
