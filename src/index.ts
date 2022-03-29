import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (_: Request, res: Response) => res.json("yes"));

app.listen(8000, () => console.log("Server listening on 8000"));
