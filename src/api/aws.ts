import { Request, Response } from "express";
import multiparty from "multiparty";

import cache from "../cache";
import { handleClose } from "./controllers/multiparty";
import { get as s3Get } from "./controllers/s3";

const user_id = "6240cb0d37bfec510178ba44";

const get = async (req: Request, res: Response) => {
  try {
    const { album, file } = req.query || {};

    if (!album || !file) {
      throw new Error("No body");
    }

    const key = `${user_id}/${album}/${file}`;

    const cached = await cache.get(key);

    if (cached.data && cached.data !== null) {
      const data: string = JSON.parse(cached.data);

      return res.json({ data });
    }

    const data = await s3Get(key, file as string);

    if (data.error) {
      throw new Error(data.error);
    }

    await cache.set(key, JSON.stringify(data.data));

    return res.json({ data: data.data });
  } catch (error: any) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

const upload = (req: Request, res: Response) => {
  const { album } = req.query || {};

  if (!album) {
    return res.status(500).json({ error: "No query" });
  }

  let filename = "";

  const chunks: Uint8Array[] = [];
  const form = new multiparty.Form();

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

  form.on("close", () =>
    handleClose(res, chunks, {
      user: user_id,
      album: album as string,
      filename,
    }),
  );

  form.on("error", (error) => res.status(500).json({ error: error.message }));

  form.parse(req);
};

export { get, upload };
