import puppeteer from "puppeteer";

async function start() {
  let data = [];
  for (let j = 1; j <= 25; j++) {
    const url =
      "https://www.sreality.cz/en/search/for-sale/apartments/all-countries?page=" +
      j;

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox"], // Required.
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(url, { timeout: 50000, waitUntil: "networkidle2" });

    await page.setDefaultNavigationTimeout(0);

    const pageData = await page.evaluate(() => {
      const titlesArray: string[] = [];
      const urlsArray: string[] = [];
      for (var i = 0; i < 20; i++) {
        const titleElement = document.getElementsByClassName("name")[i];
        const imgElement = document.querySelectorAll(
          "[component='property-carousel'] a:first-child img"
        )[i] as HTMLImageElement | null;
        titlesArray.push(titleElement.textContent);
        urlsArray.push(imgElement.src);
      }

      return { titlesArray, urlsArray };
    });

    data.push(pageData);
    await browser.close();
  }
  return data;
}

async function insertData() {
  const fullData = await start();
  let count = 0;
  for (let i = 0; i < 25; i++) {
    let pageData = fullData[i];
    for (let j = 0; j < 20; j++) {
      count++;
      console.log(count);
      try {
        const res = await pool.query(
          "INSERT INTO siteDB (id, title, url) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET title = $2, url = $3;",

          [count, pageData.titlesArray[j], pageData.urlsArray[j]]
        );
        console.log("Succesfully added item " + i);
      } catch (error) {
        console.error(error);
      }
    }
  }
  console.log("db data added");
}
insertData();

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const app: Express = express();
const cors = require("cors");

app.use(cors());

const port = process.env.PORT || 3005;

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  database: "postgres",
  password: "Postgres555",
  port: 5432,
  host: "postgres",
});

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
