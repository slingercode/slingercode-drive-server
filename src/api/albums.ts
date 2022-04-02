import { Request, Response } from "express";

import cache from "../../cache";
import Album from "../../models/album-schema";

const user_id = "6240cb0d37bfec510178ba44";
const user_name = "noel";

const getAlbums = async (_: Request, res: Response) => {
  try {
    const cackeKey = `${user_id}/albums`;
    const cached = await cache.get(cackeKey);

    if (cached.data && cached.data !== null) {
      return res.json({ albums: JSON.parse(cached.data) });
    }

    const data = await Album.find({ "user._id": user_id });

    const albums = data.map((album) => ({ _id: album._id, name: album.name }));

    cache.set(cackeKey, JSON.stringify(albums));

    res.json({ albums });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

const getAlbum = async (req: Request, res: Response) => {
  try {
    const { id } = req.query || {};

    if (!id) {
      throw new Error("No query");
    }

    const cacheKey = `${user_id}/${id}`;
    const cached = await cache.get(cacheKey);

    if (cached.data && cached.data !== null) {
      return res.json({ album: JSON.parse(cached.data) });
    }

    const album = await Album.findById(id);

    if (album) {
      cache.set(cacheKey, JSON.stringify(album));
    }

    res.json({ album });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

const createAlbum = async (req: Request, res: Response) => {
  try {
    const { album } = req.body || {};

    if (!album) {
      throw new Error("No body");
    }

    const body = {
      user: {
        _id: user_id,
        name: user_name,
      },
      name: album,
      files: [],
    };

    const data = new Album(body);

    const newAlbum = await data.save();

    await cache.del(`${user_id}/albums`);

    res.json({ album: newAlbum });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

const updateAlbum = async (req: Request, res: Response) => {
  try {
    const { id, file } = req.body || {};

    if (!id) {
      throw new Error("No body");
    }

    const data = await Album.findByIdAndUpdate(id, {
      $addToSet: { files: file },
    });

    return res.json({ res: data });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export { getAlbums, getAlbum, createAlbum, updateAlbum };
