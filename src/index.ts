import puppeteer from "puppeteer";

interface propertyData {
  title: string;
  imgUrl: string;
}

(async () => {
  for (var j = 1; j <= 25; j++) {
    const url =
      "https://www.sreality.cz/en/search/for-sale/apartments/all-countries?page=" +
      j;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
      const elementsArray: propertyData[] = [];
      for (var i = 0; i < 20; i++) {
        const titleElement = document.getElementsByClassName("name")[i];
        const imgElement = document.querySelectorAll(
          "[component='property-carousel'] a:first-child img"
        )[i] as HTMLImageElement | null;
        const elementObj: propertyData = {
          title: titleElement.textContent,
          imgUrl: imgElement.src,
        };
        elementsArray.push(elementObj);
      }

      return elementsArray;
    });

    console.log(data);

    await browser.close();
  }
})();
