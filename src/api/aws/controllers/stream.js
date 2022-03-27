// REFERENCE: https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-755446927
// Apparently the stream parameter should be of type Readable|ReadableStream|Blob
// The latter 2 don't seem to exist anywhere.
const streamToBase64 = async (stream) =>
  await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
  });

const stremTobuffer = async (stream) =>
  await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

module.exports = { streamToBase64, stremTobuffer };
