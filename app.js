require("dotenv").config();
require("./database/connect").connect();
const express = require("express");
const cors = require("cors");

const router = require("./router/router");

const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/storage", express.static("data"));
app.use(router);

app.get("/", (req, res) => {
  res.json({
    message: "TEDx SJEC API",
    author: "Team Delta SJEC",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});