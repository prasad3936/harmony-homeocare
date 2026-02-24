const express = require("express");
const db = require("../db");
const generateCode = require("../utils/generateCode");

const router = express.Router();

router.get("/slots", (req, res) => {
  db.all(
    `
    SELECT * FROM slots
    WHERE is_booked = 0
    ORDER BY slot_date, start_time
  `,
    [],
    (err, rows) => {
      res.json(rows);
    },
  );
});

router.post("/book", (req, res) => {
  const f = req.body;

  db.get(
    `
    SELECT * FROM slots
    WHERE id=? AND is_booked=0
  `,
    [f.slot_id],
    (err, slot) => {
      if (!slot) {
        return res.status(400).json({ error: "Slot unavailable" });
      }

      const code = generateCode();
      const now = new Date().toISOString();

      db.run(
        `
      INSERT INTO appointments (
        confirmation_code,
        patient_name, mobile, address,
        slot_id, appointment_date, slot_time,
        consultation_type, amount,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'RESERVED', ?, ?)
    `,
        [
          code,
          f.patient_name,
          f.mobile,
          f.address,
          slot.id,
          slot.slot_date,
          `${slot.start_time}-${slot.end_time}`,
          f.consultation_type || "FIRST",
          f.amount || 0,
          now,
          now,
        ],
        () => {
          db.run(`UPDATE slots SET is_booked=1 WHERE id=?`, [slot.id]);
          res.json({ success: true, code });
        },
      );
    },
  );
});

module.exports = router;
