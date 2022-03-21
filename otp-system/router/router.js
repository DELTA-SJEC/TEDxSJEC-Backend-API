const router = require("express").Router();
const multer = require("multer");
const AuthController = require("../controller/auth-controller");
const upload = multer();

router.post("/api/send-otp", upload.none(), AuthController.sendOtp);

module.exports = router;
