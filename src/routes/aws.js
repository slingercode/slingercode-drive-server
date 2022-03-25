const sharp = require("sharp");
const express = require("express");
const multiparty = require("multiparty");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const redis = require("../lib/redis");
const { s3Client } = require("../lib/aws");
const { streamToBase64 } = require("../helpers/utils");

const router = express.Router();

router.post("/get-albums", async (req, res) => {
  try {
    const { user } = req.body;

    if (!req.body || !user) {
      throw new Error("No user");
    }

    const albums = await redis.get(user);

    if (!albums) {
      return res.json({ albums: [] });
    }

    const parsed = JSON.parse(albums);

    return res.json({ albums: Object.keys(parsed) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/get-album", async (req, res) => {
  try {
    const { user, album } = req.body;

    if (!req.body || !user || !album) {
      throw new Error("No body");
    }

    const albums = await redis.get(user);

    if (!albums) {
      throw new Error("No albums");
    }

    const parsed = JSON.parse(albums);

    return res.json({ data: parsed[album] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/create-album", async (req, res) => {
  try {
    const { user, album } = req.body;

    if (!req.body || !user || !album) {
      throw new Error("No body");
    }

    const dbUser = await redis.get(user);

    if (!dbUser) {
      await redis.set(user, JSON.stringify({ [album]: [] }));
      return res.json({ album });
    }

    let parsed = JSON.parse(dbUser);
    const albums = Object.keys(parsed);

    if (albums.some((_album) => _album === album)) {
      throw new Error("This album already exists");
    }

    parsed = { ...parsed, [album]: [] };

    await redis.set(user, JSON.stringify(parsed));

    return res.json({ album });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/upload", (req, res) => {
  const { user, album } = req.query;

  if (!req.query || !user || !album) {
    return res.status(500).json({ error: "No query" });
  }

  let filename = "";
  const chunks = [];
  const form = new multiparty.Form();

  form.on("error", (error) => res.status(500).json({ error: error.message }));

  form.on("part", (part) => {
    if (part.filename === undefined) {
      part.resume();
    }

    if (part.filename !== undefined) {
      filename = part.filename.split(".")[0];
      part.on("data", (chunk) => chunks.push(chunk));
      part.resume();
    }

    part.on("error", (error) => res.status(500).json({ error: error.message }));
  });

  form.on("close", () => {
    const buffer = Buffer.concat(chunks);

    sharp(buffer)
      .webp()
      .toBuffer()
      .then(async (blob) => {
        try {
          const albums = await redis.get(user);

          if (!albums) {
            throw new Error("No albums");
          }

          let parsed = JSON.parse(albums);
          const selectedAlbum = parsed[album];

          if (selectedAlbum.some((name) => name.includes(filename))) {
            throw new Error("Same name");
          }

          parsed = {
            ...parsed,
            [album]: [...parsed[album], `${filename}.webp`],
          };

          await redis.set(user, JSON.stringify(parsed));

          await s3Client.send(
            new PutObjectCommand({
              Bucket: "slingercode-test-1",
              Key: `${user}/${album}/${filename}.webp`,
              Body: blob,
            })
          );

          return res.status(200).json({ newFile: `${filename}.webp` });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  });

  form.parse(req);
});

router.post("/get", async (req, res) => {
  try {
    const { user, album, file } = req.body;

    if (!req.body || !user || !album || !file) {
      throw new Error("No body");
    }

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: "slingercode-test-1",
        Key: `${user}/${album}/${file}`,
      })
    );

    const base64 = await streamToBase64(response.Body);

    res.writeHead(200, {
      "Content-Type": "img/webp",
      "Content-Length": base64.length,
    });

    return res.end(base64);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
