import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sizeOf from "image-size";
import s3Client from "../../lib/aws";
import { streamTobuffer } from "../../helpers/stream";

const get = async (
  Key: string,
): Promise<{
  data: {
    width: number;
    height: number;
    data: string;
  } | null;
  error: string | null;
}> => {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: "slingercode-test-1",
        Key,
      }),
    );

    const buffer = await streamTobuffer(response.Body);
    const dimension = sizeOf(buffer);

    return {
      data: {
        width: dimension.width!,
        height: dimension.height!,
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
        Bucket: "slingercode-test-1",
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
