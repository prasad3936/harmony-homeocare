const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://harmonyhomeo.netlify.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
    },
  }),
);

app.use("/uploads", express.static("uploads"));

app.use("/api/patient", require("./routes/patient"));
app.use("/api/status", require("./routes/status"));
app.use("/api/history", require("./routes/history"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/pdf", require("./routes/pdf"));
app.use("/api/admin", require("./routes/admin"));


require("./scheduler");

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
