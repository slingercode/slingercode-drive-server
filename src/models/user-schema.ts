import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    auth0: String,
    username: String,
  },
  { versionKey: false },
);

const User = model("user", userSchema);

export default User;
