// REFERENCE: https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-755446927
// Apparently the stream parameter should be of type Readable|ReadableStream|Blob
// The latter 2 don't seem to exist anywhere.
const streamToString = async (stream) =>
  await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

const streamToBase64 = async (stream) =>
  await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => {
      // console.log(chunks);
      return resolve(Buffer.concat(chunks).toString("base64"));
    });
  });

module.exports = { streamToString, streamToBase64 };
