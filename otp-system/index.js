const express = require("express");
require("dotenv").config();
const cors = require("cors");

const router = require("./router/router");

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(router);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
