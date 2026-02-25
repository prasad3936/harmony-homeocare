const express = require("express");
const db = require("../db");
const buildMessage = require("../utils/messageBuilder");

const router = express.Router();

/* =========================
   AUTH MIDDLEWARE
========================= */
function requireAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/* =========================
   LOGIN
========================= */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    req.session.admin = true;

    req.session.save((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Session save failed" });
      }

      res.json({ success: true });
    });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

/* =========================
   DASHBOARD
========================= */
router.get("/dashboard", requireAdmin, async (req, res) => {
  const { status, search } = req.query;

  /* ---------- STATS ---------- */
  db.get(
    `
    SELECT
      (SELECT COUNT(*) FROM appointments) as total,
      (SELECT COUNT(*) FROM appointments WHERE status='RESERVED') as reserved,
      (SELECT COUNT(*) FROM appointments WHERE status='CONFIRMED') as confirmed,
      (SELECT COUNT(*) FROM appointments WHERE appointment_date=DATE('now')) as today,
      (SELECT COALESCE(SUM(amount),0) FROM appointments WHERE status='CONFIRMED') as revenue
    `,
    [],
    async (err, stats) => {
      if (err) {
        console.error("Stats error:", err);
        return res.status(500).json({ error: "Stats failed" });
      }

      /* ---------- FILTER QUERY ---------- */
      let query = `SELECT * FROM appointments WHERE 1=1`;
      const params = [];

      if (status) {
        query += ` AND status=?`;
        params.push(status);
      }

      if (search) {
        query += ` AND (patient_name LIKE ? OR mobile LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY appointment_date DESC`;

      db.all(query, params, async (err, appointments) => {
        if (err) return res.status(500).json({ error: "Appointments failed" });

        db.all(
          `SELECT * FROM slots ORDER BY slot_date, start_time`,
          [],
          async (err, slots) => {
            if (err) return res.status(500).json({ error: "Slots failed" });

            db.get(
              `SELECT * FROM admin_settings WHERE id=1`,
              [],
              async (err, settings) => {
                if (err || !settings)
                  return res.status(500).json({ error: "Settings failed" });

                const BASE_URL = "http://localhost:5000";

                const enrichedAppointments = await Promise.all(
                  appointments.map((a) => {
                    return new Promise((resolve) => {
                      db.get(
                        `SELECT COUNT(*) as count FROM medical_reports WHERE confirmation_code=?`,
                        [a.confirmation_code],
                        (err, reportData) => {
                          const reportCount = reportData?.count || 0;

                          const consultationType = (
                            a.consultation_type || "FIRST"
                          ).toUpperCase();

                          const amount =
                            consultationType === "FOLLOWUP"
                              ? settings.followup_amount
                              : settings.default_amount;

                          const meetingLink =
                            a.meeting_link ||
                            settings.default_meeting_link ||
                            "";

                          const receiptLink = `${BASE_URL}/api/pdf/${a.confirmation_code}`;
                          const uploadLink = `${BASE_URL}/api/upload/${a.confirmation_code}`;

                          const paymentMsg = buildMessage(
                            settings.reservation_message,
                            {
                              name: a.patient_name,
                              date: a.appointment_date,
                              time: a.slot_time,
                              amount,
                              upi: settings.upi_link,
                            },
                          );

                          const confirmMsg = buildMessage(
                            settings.confirmation_message,
                            {
                              name: a.patient_name,
                              code: a.confirmation_code,
                              date: a.appointment_date,
                              time: a.slot_time,
                              meeting_link: meetingLink,
                              receipt_link: receiptLink,
                              upload_link: uploadLink,
                            },
                          );

                          resolve({
                            ...a,
                            amount,
                            meeting_link_final: meetingLink,
                            report_count: reportCount,
                            payment_whatsapp_link: `https://wa.me/${a.mobile}?text=${confirmMsg}`,
                            confirmation_whatsapp_link: `https://wa.me/${a.mobile}?text=${confirmMsg}`,
                          });
                        },
                      );
                    });
                  }),
                );

                res.json({
                  stats,
                  appointments: enrichedAppointments,
                  slots,
                });
              },
            );
          },
        );
      });
    },
  );
});

/* =========================
   UPDATE APPOINTMENT
========================= */
router.post("/update/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, meeting_link } = req.body;
  const now = new Date().toISOString();

  db.get(`SELECT * FROM appointments WHERE id=?`, [id], (err, appt) => {
    if (!appt) return res.status(404).json({ error: "Not found" });

    let finalStatus = status || appt.status;

    // 🔥 AUTO-CONFIRM IF MEETING LINK ADDED
    if (meeting_link && appt.status === "RESERVED") {
      finalStatus = "CONFIRMED";
    }

    db.run(
      `
      UPDATE appointments
      SET status=?,
          meeting_link=COALESCE(?, meeting_link),
          updated_at=?
      WHERE id=?
      `,
      [finalStatus, meeting_link, now, id],
      function (err) {
        if (err) return res.status(500).json({ error: "Update failed" });

        res.json({
          success: true,
          autoConfirmed: finalStatus === "CONFIRMED",
        });
      },
    );
  });
});

/* =========================
   SEND REMINDER
========================= */
router.post("/send-reminder/:id", requireAdmin, (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM appointments WHERE id=?`, [id], (err, appt) => {
    if (!appt) return res.status(404).json({ error: "Not found" });

    db.get(`SELECT * FROM admin_settings WHERE id=1`, [], (err, settings) => {
      const reminderMsg = buildMessage(settings.reminder_message, {
        name: appt.patient_name,
        time: appt.slot_time,
      });

      const link = `https://wa.me/${appt.mobile}?text=${reminderMsg}`;

      res.json({ whatsappLink: link });
    });
  });
});

/* =========================
   DELETE SLOT
========================= */
router.post("/delete-slot/:id", requireAdmin, (req, res) => {
  db.run(`DELETE FROM slots WHERE id=? AND is_booked=0`, [req.params.id]);
  res.json({ success: true });
});

/* =========================
   ADD SLOT
========================= */
router.post("/add-slot", requireAdmin, (req, res) => {
  const { slot_date, start_time, end_time } = req.body;

  db.run(
    `INSERT INTO slots (slot_date, start_time, end_time, is_booked)
     VALUES (?, ?, ?, 0)`,
    [slot_date, start_time, end_time],
    function (err) {
      if (err) return res.status(500).json({ error: "Slot creation failed" });

      res.json({ success: true });
    },
  );
});

module.exports = router;
