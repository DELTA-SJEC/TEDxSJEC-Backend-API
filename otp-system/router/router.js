const router = require("express").Router();
const multer = require("multer");
const AuthController = require("../controller/auth-controller");
const {
  register,
  currentUser,
  login,
} = require("../controller/user-controller");
const upload = multer();
const auth = require("../service/verify-jwt-token");

// OTP Generate/Verify & Generate Order Part
router.post("/api/send-otp", upload.none(), AuthController.sendOtp);
router.post("/api/verify-otp", upload.none(), AuthController.verifyOtp);

// Push Success Payment Data to DB

// Admin Login Part
router.post("/api/register", upload.none(), register);
router.get("/api/current/user", auth, currentUser);
router.post("/api/login", upload.none(), login);

module.exports = router;
