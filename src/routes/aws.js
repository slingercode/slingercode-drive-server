const router = require("express").Router();
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const awsClient = require("../lib/aws-client");

const { streamToBase64, getBuffer } = require("../helpers/utils");

router.get("/", async (_, res) => {
  try {
    const response = await awsClient.send(
      new GetObjectCommand({
        Bucket: "slingercode-test-1",
        Key: "noel/1627829348697.png",
      })
    );

    const bodyContents = await streamToBase64(response.Body);

    res.writeHead(200, {
      "Content-Type": "img/png",
      "Content-Length": bodyContents.length,
    });

    return res.end(bodyContents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/webp", async (_, res) => {
  try {
    const response = await awsClient.send(
      new GetObjectCommand({
        Bucket: "slingercode-test-1",
        Key: "noel/1627829348697.png",
      })
    );

    const buffer = await getBuffer(response.Body);

    const newFormat = await sharp(buffer).webp().toBuffer();

    const bodyContents = newFormat.toString("base64");

    res.writeHead(200, {
      "Content-Type": "img/webp",
      "Content-Length": bodyContents.length,
    });

    return res.end(bodyContents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
