const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

/* =============================
   ALLOWED FRONTENDS
============================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://harmonyhomeo.netlify.app",
  "https://harmony-homeocare.netlify.app",
];

/* =============================
   CORS
============================= */

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server tools / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS:", origin);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

/* VERY IMPORTANT */
//app.options("*", cors());

/* =============================
   BODY PARSER
============================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =============================
   TRUST RENDER PROXY
============================= */

app.set("trust proxy", 1);

/* =============================
   SESSION
============================= */

app.use(
  session({
    name: "harmony.sid", // ⭐ important
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,

    cookie: {
      secure: true, // HTTPS required
      sameSite: "none", // Netlify → Render
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  }),
);

/* =============================
   STATIC
============================= */

app.use("/uploads", express.static("uploads"));

/* =============================
   ROUTES
============================= */

app.use("/api/patient", require("./routes/patient"));
app.use("/api/status", require("./routes/status"));
app.use("/api/history", require("./routes/history"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/pdf", require("./routes/pdf"));
app.use("/api/admin", require("./routes/admin"));

require("./scheduler");

/* =============================
   HEALTH CHECK
============================= */

app.get("/", (req, res) => {
  res.send("Harmony Backend Running ✅");
});

/* =============================
   START
============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
