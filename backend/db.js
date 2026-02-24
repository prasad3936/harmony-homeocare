const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "medbuddy.db");

console.log("USING DB:", DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error(err);
  else console.log("Connected to SQLite");
});

module.exports = db;
