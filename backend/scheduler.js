const cron = require("node-cron");

cron.schedule("*/10 * * * *", () => {
  console.log("Auto-expire job running...");
});
