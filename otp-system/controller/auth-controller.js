const { validateEmailPhone } = require("../service/validator");
const { sendOtpOverEmail } = require("../service/email-service");
const OtpService = require("../service/otp-service");
const HashService = require("../service/hash-service");
const PaymentService = require("../service/payment-service");

class AuthController {
  async sendOtp(req, res) {
    try {
      const { email, phone } = req.body;
      const errors = validateEmailPhone(email, phone);
      if (errors.length > 0) {
        return res.status(400).json({
          errors,
        });
      }

      const otp = await OtpService.generateOtp();
      // const otp = 989823;

      const ttl = 1000 * 60 * 5; // 5 min
      const expires = Date.now() + ttl;
      const data = `${phone}.${otp}.${expires}`;
      const hash = HashService.hashOtp(data);

      // send OTP
      try {
        await OtpService.sendBySms(phone, otp);
        //await sendOtpOverEmail(email, otp);
        res.json({
          hash: `${hash}.${expires}`,
          phone,
          // TODO: comment this line in prod
          otp,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: "Error sending OTP",
          error: err,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { otp, hash, phone } = req.body;
      if (!otp || !hash || !phone) {
        res.status(400).json({
          message: "Missing required fields",
        });
      }

      const [hashedOtp, expires] = hash.split(".");
      if (Date.now() > +expires) {
        res.status(400).json({
          message: "OTP expired",
        });
      }

      const data = `${phone}.${otp}.${expires}`;
      const isValid = OtpService.verifyOtp(hashedOtp, data);
      if (!isValid) {
        res.status(400).json({
          message: "Invalid OTP",
        });
      }

      const response = await PaymentService.createPaymentOrder(email);
      if (!response.status) {
        res.status(500).json({
          message: "Error creating payment",
        });
      }
      res.status(200).json({
        message: "OTP verified",
        response,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
