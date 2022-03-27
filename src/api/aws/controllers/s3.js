const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const { s3Client } = require("../../../lib/aws");
const { streamToBase64 } = require("./stream");

async function get(Key) {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: "slingercode-test-1",
        Key,
      })
    );

    const data = await streamToBase64(response.Body);

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

async function upload(Key, Body) {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: "slingercode-test-1",
        Key,
        Body,
      })
    );

    return { key: Key, error: null };
  } catch (error) {
    return { key: null, error: error.message };
  }
}

module.exports = { get, upload };
