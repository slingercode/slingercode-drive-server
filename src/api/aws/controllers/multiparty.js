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
      const thumb = await imgProccessing(chunks)
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
      const cacheFull = await cache(keyFull, full.toString("base64"));
      const cacheThumb = await cache(keyThumb, thumb.toString("base64"));

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
