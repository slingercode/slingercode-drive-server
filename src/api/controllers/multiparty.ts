import { Response } from "express";
import sizeOf from "image-size";
import sharp from "sharp";

import Album from "../../models/album-schema";
import { upload } from "./s3";
import cache from "../../cache";

export const handleClose = (
  res: Response,
  chunks: Uint8Array[],
  meta: { user: string; album: string; filename: string },
) => {
  const imgProccessing = (chunks: Uint8Array[]) => {
    const buffer = Buffer.concat(chunks);
    const newImage = sharp(buffer);
    return newImage;
  };

  const db = async (_id: string, filename: string) => {
    try {
      const data = await Album.findByIdAndUpdate(_id, {
        $addToSet: { files: filename },
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  };

  const handler = async () => {
    try {
      const full = await imgProccessing(chunks).webp().toBuffer();
      const dimension = sizeOf(full);

      let width,
        height = 0;

      if (dimension && dimension.width! > dimension.height!) {
        width = 192;
        height = 112;
      } else {
        width = 192;
        height = 288;
      }

      const thumb = await imgProccessing(chunks)
        .resize({ width, height })
        .webp({ quality: 40, effort: 6 })
        .toBuffer();

      const keyFull = `${meta.user}/${meta.album}/${meta.filename}.webp`;
      const keyThumb = `${meta.user}/${meta.album}/thumb-${meta.filename}.webp`;

      const s3Full = await upload(keyFull, full);
      const s3Thumb = await upload(keyThumb, thumb);

      if (s3Full.error || s3Thumb.error) {
        throw new Error(
          `S3 - full - ${s3Full.error} - thumb - ${s3Thumb.error}`,
        );
      }

      const dbRes = await db(meta.album, `${meta.filename}.webp`);

      await cache.del(`${meta.user}/${meta.album}`);

      const cacheFullBody = {
        width: dimension.width,
        height: dimension.height,
        data: full.toString("base64"),
      };

      const cacheThumbBody = {
        width,
        height,
        data: thumb.toString("base64"),
      };

      const cacheFull = await cache.set(keyFull, JSON.stringify(cacheFullBody));
      const cacheThumb = await cache.set(
        keyThumb,
        JSON.stringify(cacheThumbBody),
      );

      return {
        s3: {
          full: s3Full.key,
          thumb: s3Thumb.key,
        },
        db: dbRes,
        cache: {
          full: {
            key: keyFull,
            error: cacheFull.error,
          },
          thumb: {
            key: keyThumb,
            error: cacheThumb.error,
          },
        },
      };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  handler()
    .then((body) => res.json(body))
    .catch((error) => res.status(500).json({ error: error.message }));
};
