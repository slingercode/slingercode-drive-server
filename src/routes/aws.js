const router = require("express").Router();
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const awsClient = require("../lib/aws-client");

const { streamToBase64 } = require("../helpers/utils");

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

module.exports = router;
