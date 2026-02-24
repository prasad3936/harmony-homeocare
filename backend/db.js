const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Correct path: go up ONE level only
const dbPath = path.resolve(__dirname, "../medbuddy.db");

console.log("USING DB:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to SQLite");
  }
});

module.exports = db;
