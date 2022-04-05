import { Request, Response } from "express";

const me = (_: Request, res: Response) => {
  return res.json("yes");
};

export default me;
