"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3005;
const { Pool } = require("pg");
const pool = new Pool({
    user: "test_user",
    database: "taskDB",
    password: "Watermelon555",
    port: 5431,
    host: "localhost",
});
dotenv_1.default.config();
app.get("/getData", (req, res) => {
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
//# sourceMappingURL=indexas.js.map