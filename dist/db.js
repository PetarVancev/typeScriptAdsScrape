"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const { Pool } = require("pg");
const pool = new Pool({
    user: "test_user",
    database: "taskDB",
    password: "Watermelon555",
    port: 5431,
    host: "localhost",
});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = [];
        for (let j = 1; j <= 25; j++) {
            const url = "https://www.sreality.cz/en/search/for-sale/apartments/all-countries?page=" +
                j;
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.goto(url, { waitUntil: "networkidle2" });
            const pageData = yield page.evaluate(() => {
                const titlesArray = [];
                const urlsArray = [];
                for (var i = 0; i < 20; i++) {
                    const titleElement = document.getElementsByClassName("name")[i];
                    const imgElement = document.querySelectorAll("[component='property-carousel'] a:first-child img")[i];
                    titlesArray.push(titleElement.textContent);
                    urlsArray.push(imgElement.src);
                }
                return { titlesArray, urlsArray };
            });
            data.push(pageData);
            yield browser.close();
        }
        return data;
    });
}
function insertData() {
    return __awaiter(this, void 0, void 0, function* () {
        const fullData = yield start();
        let count = 0;
        for (let i = 0; i < 25; i++) {
            let pageData = fullData[i];
            for (let j = 0; j < 20; j++) {
                count++;
                try {
                    const res = yield pool.query("INSERT INTO siteDB (id, title, url) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET title = $2, url = $3;", [count, pageData.titlesArray[i], pageData.urlsArray[i]]);
                    console.log("Succesfully added item " + i);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        console.log("db data added");
    });
}
insertData();
exports.default = insertData;
//# sourceMappingURL=db.js.map