import puppeteer from "puppeteer";

const { Pool } = require("pg");

const pool = new Pool({
  user: "test_user",
  database: "taskDB",
  password: "Watermelon555",
  port: 5431,
  host: "localhost",
});

async function start() {
  let data = [];
  for (let j = 1; j <= 25; j++) {
    const url =
      "https://www.sreality.cz/en/search/for-sale/apartments/all-countries?page=" +
      j;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

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
    console.log(pageData);
    for (let j = 0; j < 20; j++) {
      count++;
      try {
        const res = await pool.query(
          "INSERT INTO siteDB (id, title, url) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET title = $2, url = $3;",

          [count, pageData.titlesArray[i], pageData.urlsArray[i]]
        );
        console.log("Succesfully added item " + i);
      } catch (error) {
        console.error(error);
      }
    }
  }
  console.log("done");
}
insertData();
