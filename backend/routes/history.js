const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/:mobile", (req, res) => {
  db.all(
    `
    SELECT * FROM appointments
    WHERE mobile=?
    ORDER BY created_at DESC
  `,
    [req.params.mobile],
    (err, rows) => {
      res.json(rows);
    },
  );
});

module.exports = router;
