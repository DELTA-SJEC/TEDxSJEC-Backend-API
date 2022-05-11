const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "vigneshshettyin",
  api_key: "858959461846469",
  api_secret: "W4f2mATc9eCTwYq9y1xJ2RjTqGs",
  secure: true,
});

module.exports = cloudinary;
