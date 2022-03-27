const cache = require("../../cache");
const { Album } = require("../../lib/mongoose");

// Auth token
const user_id = "6240cb0d37bfec510178ba44";
const user_name = "noel";

async function getAlbums(_, res) {
  try {
    const cacheKey = `${user_id}/albums`;
    const cached = await cache.get(cacheKey);

    if (cached.data && cached.data !== null) {
      return res.json({ albums: JSON.parse(cached.data) });
    }

    const data = await Album.find({ "user._id": user_id });

    const albums = data.map((album) => ({ _id: album._id, name: album.name }));

    cache.set(cacheKey, JSON.stringify(albums));

    res.json({ albums });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getAlbum(req, res) {
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
    return res.status(500).json({ error: error.message });
  }
}

async function createAlbum(req, res) {
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

    await cache.delete(`${user_id}/albums`);

    res.json({ album: newAlbum });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function updateAlbum(req, res) {
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
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { getAlbums, getAlbum, createAlbum, updateAlbum };
