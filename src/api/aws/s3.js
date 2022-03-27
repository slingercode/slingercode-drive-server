const multiparty = require("multiparty");

const cache = require("../../cache");
const { handleClose } = require("./controllers/multiparty");
const { get: s3Get } = require("./controllers/s3");

// Auth token
const user_id = "6240cb0d37bfec510178ba44";
// const user_name = "noel";

async function get(req, res) {
  try {
    const { album, file } = req.query || {};

    if (!album || !file) {
      throw new Error("No body");
    }

    const key = `${user_id}/${album}/${file}`;

    const cached = await cache.get(key);

    if (cached.data && cached.data !== null) {
      res.writeHead(200, {
        "Content-Type": "img/webp",
        "Content-Length": cached.data.length,
      });

      return res.end(cached.data);
    }

    const data = await s3Get(key);

    if (data.error) {
      throw new Error(data.error);
    }

    await cache.set(key, data.data);

    res.writeHead(200, {
      "Content-Type": "img/webp",
      "Content-Length": data.data.length,
    });

    return res.end(data.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function upload(req, res) {
  const { album } = req.query || {};

  if (!album) {
    return res.status(500).json({ error: "No query" });
  }

  let filename = "";

  const chunks = [];
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
    handleClose(res, chunks, { user: user_id, album, filename })
  );

  form.on("error", (error) => res.status(500).json({ error: error.message }));

  form.parse(req);
}

module.exports = { get, upload };
