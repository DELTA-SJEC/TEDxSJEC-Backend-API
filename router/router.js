const router = require("express").Router();
const path = require("path");
const AuthController = require("../controller/auth-controller");
const PaymentController = require("../controller/payment-controller");
const {
  register,
  currentUser,
  login,
} = require("../controller/user-controller");
const multer = require("multer");
const auth = require("../service/verify-jwt-token");
const { getFileStream } = require("../service/s3-service");
const upload = multer({ dest: "uploads/" });

// OTP Generate/Verify & Generate Order Part
router.post("/api/send-otp", upload.none(), AuthController.sendOtp);
router.post("/api/verify-otp", upload.none(), AuthController.verifyOtp);

// Push Success Payment Data to DB
router.post(
  "/api/payment-success",
  upload.single("avatar"),
  PaymentController.PaymentSuccess
);

router.post(
  "/api/payment-success-v2-for-not-reflected",
  upload.single("avatar"),
  auth,
  PaymentController.PaymentSuccessNonReflect
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
  try {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "../log/access-logs/access.log"));
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error,
    });
  }
});

// Dashboard Error Logs
//TODO:
router.get("/api/server/log/error", auth, (req, res) => {
  try {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "../log/request-logs/error.log"));
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error,
    });
  }
});

router.get("/api/server/log/info", auth, (req, res) => {
  try {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "../log/request-logs/info.log"));
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error,
    });
  }
});

router.get("/images/:key", (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

module.exports = router;
