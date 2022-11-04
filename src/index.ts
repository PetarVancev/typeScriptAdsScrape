import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
// import insertData from "./db";

const app: Express = express();
const cors = require("cors");

app.use(cors());

const port = process.env.PORT || 3007;

const { Pool } = require("pg");

const pool = new Pool({
  user: "test_user",
  database: "taskDB",
  password: "Watermelon555",
  port: 5431,
  host: "localhost",
});

dotenv.config();

app.get("/getData", (req: Request, res: Response) => {
  pool.query("SELECT * FROM sitedb ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
