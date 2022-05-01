require("dotenv").config();
require("./database/connect").connect();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const favicon = require("serve-favicon");

const router = require("./router/router");

const PORT = process.env.PORT || 8080;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./log/access-logs/access.log"),
  { flags: "a" }
);

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(favicon(path.join(__dirname, "data", "favicon.png")));
app.use(cors(corsOptions));
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/storage", express.static("data"));
app.use(router);

app.get("/", (req, res) => {
  res.json({
    message: "TEDxSJEC Payment API",
    author: "Team Delta SJEC",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
