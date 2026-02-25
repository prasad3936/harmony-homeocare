const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://harmonyhomeo.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));






/* VERY IMPORTANT FOR RENDER */
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
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
