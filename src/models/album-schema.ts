import { Schema, model } from "mongoose";

const albumsSchema = new Schema(
  {
    user: {
      _id: String,
      name: String,
    },
    name: String,
    files: [String],
  },
  { versionKey: false },
);

const Album = model("album", albumsSchema);

export default Album;
