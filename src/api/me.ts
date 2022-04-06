import { Request, Response } from "express";

import User from "../models/user-schema";

const me = async (req: Request, res: Response) => {
  try {
    const sub = req.headers["user-sub"];
    const name = req.headers["user-name"];
    const email = req.headers["user-email"];

    if (!sub || !name || !email) {
      throw new Error("Bad user input");
    }

    const prev = await User.findOne({ auth0: sub });

    if (prev) {
      return res.json({ ...prev });
    }

    const user = new User({
      name,
      email,
      auth0: sub,
      username: "",
    });

    const newUser = await user.save();

    if (!newUser) {
      throw new Error("Error storing data");
    }

    return res.json({ ...newUser._doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default me;
