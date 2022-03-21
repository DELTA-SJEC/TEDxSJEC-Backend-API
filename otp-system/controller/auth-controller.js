const { validateEmailPhone } = require("../service/validator");

class AuthController {
  async sendOtp(req, res) {
    try {
      const { email, phone } = req.body;
      console.log(email, phone);
      const errors = validateEmailPhone(email, phone);
      if (errors.length > 0) {
        return res.status(400).json({
          errors,
        });
      }
      res.json({
        message: "OTP sent successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
