const cors = require("cors");
const express = require("express");
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
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
