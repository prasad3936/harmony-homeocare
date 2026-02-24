const express = require("express");
const multer = require("multer");
const db = require("../db");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/:code", upload.single("report"), (req, res) => {
  db.run(
    `
    INSERT INTO medical_reports
    (confirmation_code, file_name, file_path, uploaded_at)
    VALUES (?, ?, ?, ?)
  `,
    [
      req.params.code,
      req.file.originalname,
      req.file.path,
      new Date().toISOString(),
    ],
    () => {
      res.json({ success: true });
    },
  );
});

module.exports = router;
