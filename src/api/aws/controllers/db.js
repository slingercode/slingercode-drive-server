const { Album } = require("../../../lib/mongoose");

async function update(id, filename) {
  try {
    const data = await Album.findByIdAndUpdate(id, {
      $addToSet: { files: filename },
    });

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

module.exports = { update };
