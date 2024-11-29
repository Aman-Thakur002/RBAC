const express = require('express');
const path = require('path');
const cors = require('cors');
const dataFilter = require('./middleware/filter.js');
const routers = require('./routes/index.routes.js');
const db = require('./models/index.js');
const dotenv = require('dotenv');
const { I18n } = require("i18n");

const { sequelize } = db;
const app = express();
require("dotenv").config();

/* Cors middleware */
app.use(cors());

/* Express middleware */
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

app.use("/public", express.static(path.join(__dirname, "../public")));

/* Express middleware for body requests */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("etag", false);

// Apply GET API Filter Data
app.use(dataFilter);

// global i18n configuration
export const i18n = new I18n({
  locales : ["en"],
  directory: path.join(__dirname, "translation"),
  defaultLocale: "en",
  objectNotation: true,
  header: "locale",
});
app.use(i18n.init);

// Set Global Variable
app.use("/api", routers);

// For undefined routes
app.get("/*", (req, res) => {
  res.status(404).send("We couldn't find the endpoint you were looking for!");
});

/* Error handler */
app.use(function (err, req, res, next) {
  if (err === "AccessDenied") {
    res.status(403).send({ status: "error", message: "Access Denied!" });
  }

  res.statusMessage = err;
  res.status(500).send({
    status: "error",
    message: "Server error, Something went wrong!",
    error: err,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
