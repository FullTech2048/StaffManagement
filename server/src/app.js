const cors = require("cors");
const express = require("express");
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorHandler");
const { frontendUrls } = require("./config/env");

const app = express();

const allowedOrigins = new Set([...frontendUrls, "http://localhost:5173"]);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/$/, "");

      if (!normalizedOrigin || allowedOrigins.has(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ data: { status: "ok" } });
});

app.use("/api/employees", employeeRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found.",
    },
  });
});

app.use(errorHandler);

module.exports = app;
