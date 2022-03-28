const sizeOf = require("image-size");

const { imgProccessing } = require("./sharp");
const { upload } = require("./s3");
const { save: cache, remove } = require("./cache");
const { update: db } = require("./db");

function handleClose(res, chunks, imgMeta) {
  const { user, album, filename } = imgMeta || {};

  if (!user || !album || !filename) {
    return res.status(500).json({ error: "No image metadata" });
  }

  async function handler() {
    try {
      const full = await imgProccessing(chunks).webp().toBuffer();
      const dimension = sizeOf(full);

      let width,
        height = 0;

      if (dimension && dimension.width > dimension.height) {
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

      const keyFull = `${user}/${album}/${filename}.webp`;
      const keyThumb = `${user}/${album}/thumb-${filename}.webp`;

      const s3Full = await upload(keyFull, full);
      const s3Thumb = await upload(keyThumb, thumb);

      if (s3Full.error || s3Thumb.error) {
        throw new Error(
          `S3 - full - ${s3Full.message} - thumb - ${s3Thumb.error}`
        );
      }

      // DATABASE
      const dbRes = await db(album, `${filename}.webp`);

      await remove(`${user}/${album}`);

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

      const cacheFull = await cache(keyFull, JSON.stringify(cacheFullBody));
      const cacheThumb = await cache(keyThumb, JSON.stringify(cacheThumbBody));

      return {
        s3: {
          full: s3Full.key,
          thumb: s3Thumb.key,
        },
        db: dbRes,
        cache: {
          full: {
            key: cacheFull.key,
            error: cacheFull.error,
          },
          thumb: {
            key: cacheThumb.key,
            error: cacheThumb.error,
          },
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  handler()
    .then((body) => res.json(body))
    .catch((error) => res.status(500).json({ error: error.message }));
}

module.exports = { handleClose };
