const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const AuthController = require("../controller/auth-controller");
const PaymentController = require("../controller/payment-controller");
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
router.post(
  "/api/payment-success",
  upload.single("avatar"),
  PaymentController.PaymentSuccess
);

// Admin Login & Register Part
// TODO: Disable Register Part For Prod
router.post("/api/register", upload.none(), register);
router.get("/api/current/user", auth, currentUser);
router.post("/api/login", upload.none(), login);

// Dashboard Data & App Flag Trigger Also Ticket Part
router.post(
  "/api/payment/flag",
  auth,
  upload.none(),
  PaymentController.FlagChange
);

router.post("/api/ticket", upload.none(), PaymentController.Ticket);

router.get("/api/payment/all", auth, PaymentController.AllPaymentData);

// Dashboard Access Logs
router.get("/api/server/log/access", auth, (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "../log/access-logs/access.log"));
});

// Dashboard Error Logs
//TODO:

module.exports = router;
