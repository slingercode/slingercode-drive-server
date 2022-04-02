import { Stream } from "stream";

// REFERENCE: https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-755446927
// Apparently the stream parameter should be of type Readable|ReadableStream|Blob
// The latter 2 don't seem to exist anywhere.
const streamToBase64 = async (stream: Stream): Promise<string> =>
  await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
  });

const streamTobuffer = async (stream: Stream): Promise<Buffer> =>
  await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

export { streamToBase64, streamTobuffer };
