const sharp = require("sharp");
const express = require("express");
const multiparty = require("multiparty");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const { s3Client } = require("../lib/aws");
const { streamToBase64 } = require("../helpers/utils");

const router = express.Router();

router.post("/get", async (req, res) => {
  try {
    const { folder, file } = req.body;

    if (!req.body || !folder || !file) {
      throw new Error("No body");
    }

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: "slingercode-test-1",
        Key: `${folder}/${file}`,
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

router.post("/upload", (req, res) => {
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
          const bodyContents = blob.toString("base64");

          const data = await s3Client.send(
            new PutObjectCommand({
              Bucket: "slingercode-test-1",
              Key: `noel/${filename}.webp`,
              Body: blob,
            })
          );

          return res.status(200).json({
            data,
            bodyContents,
          });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  });

  form.parse(req);
});

module.exports = router;
