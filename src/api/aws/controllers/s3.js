const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const sizeOf = require("image-size");

const { s3Client } = require("../../../lib/aws");
const { streamTobuffer } = require("./stream");

async function get(Key) {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: "slingercode-test-1",
        Key,
      })
    );

    const buffer = await streamTobuffer(response.Body);
    const dimension = sizeOf(buffer);

    return {
      data: {
        width: dimension.width,
        height: dimension.height,
        data: buffer.toString("base64"),
      },
      error: null,
    };
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
