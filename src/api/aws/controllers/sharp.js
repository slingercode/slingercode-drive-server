const sharp = require("sharp");

function imgProccessing(chunks) {
  const buffer = Buffer.concat(chunks);
  const newImage = sharp(buffer);
  return newImage;
}

module.exports = { imgProccessing };
