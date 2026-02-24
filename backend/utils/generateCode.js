const crypto = require("crypto");

function generateCode() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const random = crypto.randomBytes(2).toString("hex");

  return `MB-${timestamp}-${random}`;
}

module.exports = generateCode; // ✅ IMPORTANT
