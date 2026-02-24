const express = require("express");
const PDFDocument = require("pdfkit");
const db = require("../db");

const router = express.Router();

/* ============================
   DOWNLOAD APPOINTMENT RECEIPT
============================ */

router.get("/:code", (req, res) => {
  const code = req.params.code;

  db.get(
    `
    SELECT a.*, s.doctor_whatsapp
    FROM appointments a
    JOIN admin_settings s ON s.id = 1
    WHERE a.confirmation_code = ?
  `,
    [code],
    (err, a) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!a) {
        return res.status(404).json({ error: "Invalid confirmation code" });
      }

      /* ============================
       CREATE PDF
    ============================ */

      const doc = new PDFDocument({ size: "A4", margin: 50 });

      // Set headers BEFORE piping
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${code}.pdf`);

      doc.pipe(res);

      const centerX = 300;

      // ================= HEADER =================
      doc.fontSize(20).text("Harmony HomeoCare", { align: "center" });

      doc
        .fontSize(11)
        .moveDown(0.5)
        .text("Online Homeopathy Consultation", { align: "center" });

      doc
        .fontSize(10)
        .moveDown(0.3)
        .text(`WhatsApp: +${a.doctor_whatsapp}`, { align: "center" });

      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      // ================= TITLE =================
      doc
        .moveDown()
        .fontSize(14)
        .text("CONSULTATION RECEIPT", { align: "center" });

      doc.moveDown(2);

      // ================= DETAILS =================

      const row = (label, value) => {
        doc
          .fontSize(11)
          .text(`${label}:`, 80, doc.y, { continued: true })
          .font("Helvetica-Bold")
          .text(` ${value}`);
        doc.font("Helvetica");
        doc.moveDown();
      };

      row("Receipt No", a.confirmation_code);
      row("Patient Name", a.patient_name);
      row("Mobile Number", a.mobile);
      row("Appointment Date", a.appointment_date);
      row("Time Slot", a.slot_time);
      row("Consultation Type", a.consultation_type || "FIRST");
      row("Status", a.status);
      row("Amount Paid", `₹ ${a.amount}`);

      // ================= FOOTER NOTE =================
      doc.moveDown(2);
      doc.moveTo(80, doc.y).lineTo(515, doc.y).stroke();

      doc
        .moveDown()
        .fontSize(9)
        .fillColor("gray")
        .text(
          "Note: This is a computer-generated receipt and does not require a signature.",
          { align: "center" },
        );

      doc.moveDown(2);

      doc
        .fontSize(9)
        .text("Thank you for choosing Harmony HomeoCare", { align: "center" });

      // Finalize PDF
      doc.end();
    },
  );
});

module.exports = router;
