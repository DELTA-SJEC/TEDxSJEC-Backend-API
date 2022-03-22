const Payment = require("../database/models/Payment");

class PaymentController {
  async PaymentSuccess(req, res) {
    res.status(200).json({
      message: "Payment Success",
    });
  }

  async AllPaymentData(req, res) {
    try {
      const paymentData = await Payment.find();
      res.status(200).json({
        message: "Success",
        paymentData: paymentData,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error",
        error: error,
      });
    }
  }

  async FlagChange(req, res) {
    try {
      const { id } = req.query;
      if (!id)
        return res.status(400).json({
          message: "Bad Request",
        });
      const paymentData = await Payment.findOne({
        razorpay_payment_id: id,
      });
      if (!paymentData)
        return res.status(404).json({
          message: "Payment Data Not Found",
        });

      if (paymentData.attendee_flag) {
        return res.status(400).json({
          message: "Already Flagged",
        });
      } else {
        paymentData.attendee_flag = true;
        await paymentData.save();
        res.status(200).json({
          message: "Success",
          paymentData: paymentData,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error",
        error: error,
      });
    }
  }
}

module.exports = new PaymentController();
