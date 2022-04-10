import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sizeOf from "image-size";

import s3Client from "../../lib/aws";
import { streamTobuffer } from "../../helpers/stream";
import ENV from "../../config/env";

const get = async (
  Key: string,
  file: string,
): Promise<{
  data: {
    width: number;
    height: number;
    name: string;
    data: string;
  } | null;
  error: string | null;
}> => {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: ENV.AWS.BUCKET,
        Key,
      }),
    );

    const buffer = await streamTobuffer(response.Body);
    const dimension = sizeOf(buffer);

    return {
      data: {
        width: dimension.width!,
        height: dimension.height!,
        name: file,
        data: buffer.toString("base64"),
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: (error as Error).message };
  }
};

const upload = async (
  Key: string,
  Body: Buffer,
): Promise<{ key: string | null; error: string | null }> => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: ENV.AWS.BUCKET,
        Key,
        Body,
      }),
    );

    return { key: Key, error: null };
  } catch (error: any) {
    return { key: null, error: (error as Error).message };
  }
};

export { get, upload };
