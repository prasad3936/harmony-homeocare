const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/:code", (req, res) => {
  db.get(
    `
    SELECT * FROM appointments
    WHERE confirmation_code=?
  `,
    [req.params.code],
    (err, row) => {
      if (!row) return res.status(404).json({ error: "Not found" });

      res.json(row);
    },
  );
});

router.post("/cancel/:code", (req, res) => {
  const code = req.params.code;

  db.get(
    `
    SELECT * FROM appointments WHERE confirmation_code=?
  `,
    [code],
    (err, appt) => {
      if (!appt || appt.status !== "RESERVED") {
        return res.status(400).json({ error: "Cannot cancel" });
      }

      db.run(
        `
      UPDATE appointments
      SET status='CANCELLED', updated_at=?
      WHERE confirmation_code=?
    `,
        [new Date().toISOString(), code],
      );

      db.run(
        `
      UPDATE slots SET is_booked=0
      WHERE id=?
    `,
        [appt.slot_id],
      );

      res.json({ success: true });
    },
  );
});

module.exports = router;
