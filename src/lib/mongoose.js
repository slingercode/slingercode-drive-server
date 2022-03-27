const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/cloud";

function connect() {
  mongoose.connect(uri, (error) => {
    if (error) {
      return console.error(error);
    }

    console.log("Mongodb connected!");
  });
}

const userSchema = new mongoose.Schema(
  {
    name: String,
  },
  { versionKey: false }
);

const albumsSchema = new mongoose.Schema(
  {
    user: {
      _id: String,
      name: String,
    },
    name: String,
    files: [String],
  },
  { versionKey: false }
);

module.exports = {
  connect,
  User: mongoose.model("user", userSchema),
  Album: mongoose.model("album", albumsSchema),
};
